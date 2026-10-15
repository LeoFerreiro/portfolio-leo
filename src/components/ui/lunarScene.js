import * as THREE from "three";
import { LUNAR_VISUAL as V } from "./lunarVisualConfig.js";

/** A demand-rendered moon with bounded, desktop-only pointer response. This module is loaded only after the Hero is visible. */
export function mountLunarScene(host, { onReady, onError, onFrame, initialPhase }) {
  const resources = new Set();
  const bitmaps = new Set();
  const abort = new AbortController();
  let renderer;
  let context;
  let resizeObserver;
  let visibilityObserver;
  let frame = null;
  let loadTimer;
  let currentPhase = initialPhase;
  let lastPublishedFrame;
  let sun;
  let interaction;
  let stopped = false;
  let inView = true;
  let loaded = false;
  let scene;
  let camera;
  let ready = false;
  let shaderFailed = false;
  let moon;
  let tiltX = 0;
  let tiltY = 0;
  let targetX = 0;
  let targetY = 0;
  let lastFrameTime = null;
  const pointerMedia = window.matchMedia("(hover: hover) and (pointer: fine) and (min-width: 1024px)");
  const reducedMedia = window.matchMedia("(prefers-reduced-motion: reduce)");
  const canInteract = () => pointerMedia.matches && !reducedMedia.matches;

  const own = (resource) => {
    resources.add(resource);
    return resource;
  };

  const dispose = () => {
    if (stopped) return;
    stopped = true;
    abort.abort();
    clearTimeout(loadTimer);
    if (frame !== null) cancelAnimationFrame(frame);
    resizeObserver?.disconnect();
    visibilityObserver?.disconnect();
    document.removeEventListener("visibilitychange", handleVisibility);
    window.removeEventListener("pointermove", handlePointer);
    window.removeEventListener("blur", resetPointer);
    document.removeEventListener("pointerleave", resetPointer);
    pointerMedia.removeEventListener("change", handleMotionPreference);
    reducedMedia.removeEventListener("change", handleMotionPreference);
    renderer?.domElement.removeEventListener("webglcontextlost", handleContextLost);
    renderer?.domElement.remove();
    resources.forEach((resource) => resource.dispose());
    resources.clear();
    bitmaps.forEach((bitmap) => bitmap.close());
    bitmaps.clear();
    if (renderer) {
      renderer.dispose();
      if (!context?.isContextLost()) renderer.forceContextLoss();
    } else {
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    }
    context = undefined;
    scene?.clear();
    renderer = undefined;
    scene = undefined;
    camera = undefined;
  };

  const fail = (reason) => {
    if (stopped) return;
    dispose();
    onError(reason);
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    fail("context-lost");
  };

  const requestRender = () => {
    if (stopped || !loaded || !inView || document.hidden || frame !== null) return;
    frame = requestAnimationFrame((time) => {
      frame = null;
      if (stopped || !inView || document.hidden) return;
      try {
        const delta = lastFrameTime === null ? 16.67 : Math.min(time - lastFrameTime, 50);
        lastFrameTime = time;
        const blend = 1 - Math.exp(-delta / 110);
        tiltX += (targetX - tiltX) * blend;
        tiltY += (targetY - tiltY) * blend;
        const settling = Math.abs(targetX - tiltX) + Math.abs(targetY - tiltY) > 0.00008;
        if (!settling) { tiltX = targetX; tiltY = targetY; }
        // Keep the approved terrain pose separate from its small pointer offset.
        // The light remains in the observer frame, outside this interaction group.
        interaction.rotation.set(tiltX, tiltY, 0);
        renderer.render(scene, camera);
        if (shaderFailed) {
          fail("shader-error");
          return;
        }
        host.dataset.renderCount = String(Number(host.dataset.renderCount || 0) + 1);
        if (!ready) {
          ready = true;
          onReady();
        }
        if (lastPublishedFrame !== currentPhase?.timestampMs) {
          lastPublishedFrame = currentPhase?.timestampMs;
          onFrame?.(lastPublishedFrame);
        }
        if (settling) requestRender();
        else lastFrameTime = null;
      } catch {
        fail("render-error");
      }
    });
  };

  function resetPointer() {
    targetX = 0;
    targetY = 0;
    requestRender();
  }

  function handleMotionPreference() {
    // Preference changes are immediate: reduced motion never eases towards neutral.
    targetX = targetY = tiltX = tiltY = 0;
    lastFrameTime = null;
    requestRender();
  }

  function handlePointer(event) {
    if (!ready || !canInteract() || event.pointerType !== "mouse" || !inView || document.hidden) return;
    const hero = host.closest("#hero");
    const bounds = hero?.getBoundingClientRect();
    if (!bounds || event.clientY < bounds.top || event.clientY > bounds.bottom) {
      resetPointer();
      return;
    }
    const x = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
    const y = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
    targetX = y * 0.018;
    targetY = x * 0.035;
    requestRender();
  }

  function refreshIllumination(phase = currentPhase) {
    currentPhase = phase;
    if (stopped || !loaded || !phase) return;
    try {
      sun.position.fromArray(phase.solarDirection).multiplyScalar(5);
      host.dataset.phaseTimestamp = String(phase.timestampMs);
      host.dataset.illuminatedFraction = String(phase.illuminatedFraction);
      host.dataset.solarDirection = JSON.stringify(phase.solarDirection);
      requestRender();
    } catch { fail("ephemeris-error"); }
  }
  dispose.updatePhase = refreshIllumination;

  function handleVisibility() {
    if (document.hidden && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
    refreshIllumination();
  }

  const resize = () => {
    if (stopped) return;
    try {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      const mobile = window.innerWidth < 700;
      const dpr = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 1.5);
      renderer.setPixelRatio(dpr);
      renderer.setSize(width, height, false);
      // Matches the photograph's existing disk: centre 52% / 51%, radius 39.6%.
      const horizontal = 2 / V.diameter;
      const vertical = horizontal * height / width;
      camera.left = -V.centerX * horizontal;
      camera.right = (1 - V.centerX) * horizontal;
      camera.top = V.centerY * vertical;
      camera.bottom = -(1 - V.centerY) * vertical;
      camera.updateProjectionMatrix();
      host.dataset.dpr = String(dpr);
      requestRender();
    } catch {
      fail("resize-error");
    }
  };

  const loadTexture = async (url, colorSpace) => {
    const response = await fetch(url, { signal: abort.signal });
    if (!response.ok) throw new Error("Texture request failed");
    const blob = await response.blob();
    const bitmap = await createImageBitmap(blob, { imageOrientation: "flipY" });
    if (stopped) {
      bitmap.close();
      throw new Error("Scene disposed");
    }
    bitmaps.add(bitmap);
    const texture = own(new THREE.Texture(bitmap));
    texture.colorSpace = colorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    return texture;
  };

  try {
    const canvas = document.createElement("canvas");
    context = canvas.getContext("webgl2", {
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    });
    if (!context) {
      fail("webgl-unavailable");
      return dispose;
    }
    renderer = new THREE.WebGLRenderer({
      canvas,
      context,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
      failIfMajorPerformanceCaveat: true,
    });
    renderer.debug.onShaderError = () => { shaderFailed = true; };
    if (renderer.capabilities.maxTextureSize < 1024) throw new Error("Insufficient texture capacity");
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = V.exposure;
    renderer.setClearColor(0x000000, 0);
    renderer.domElement.setAttribute("aria-hidden", "true");
    renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
    host.appendChild(renderer.domElement);

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1.3, 1.3, 1.3, -1.3, 0.1, 20);
    camera.position.set(0, 0, 4);
    camera.lookAt(0, 0, 0);

    const mobile = window.innerWidth < 700;
    const smallMaps = mobile || renderer.capabilities.maxTextureSize < 2048;
    host.dataset.quality = smallMaps ? "1k" : "2k";
    const detail = mobile ? [48, 32] : [96, 64];
    const geometry = own(new THREE.SphereGeometry(1, ...detail));
    const material = own(new THREE.MeshStandardMaterial({
      color: V.color,
      roughness: 1,
      metalness: 0,
      bumpScale: V.bumpScale,
    }));
    moon = new THREE.Mesh(geometry, material);
    // Bring the near-side maria (middle of the equirectangular map) towards the camera.
    moon.rotation.y = V.baseY;
    moon.rotation.z = V.baseZ;
    interaction = new THREE.Group();
    interaction.add(moon);
    scene.add(interaction);

    sun = new THREE.DirectionalLight(0xf4f2ec, V.sunIntensity);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xdce1e8, V.ambientIntensity));

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      refreshIllumination();
    });
    visibilityObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("blur", resetPointer);
    document.addEventListener("pointerleave", resetPointer);
    pointerMedia.addEventListener("change", handleMotionPreference);
    reducedMedia.addEventListener("change", handleMotionPreference);
    resize();

    const variant = smallMaps ? "1k" : "2k";
    loadTimer = window.setTimeout(() => fail("texture-timeout"), 10000);
    Promise.all([
      loadTexture(`/hero/lunar/moon-color-${variant}.webp`, THREE.SRGBColorSpace),
      loadTexture(`/hero/lunar/moon-bump-${variant}.webp`, THREE.NoColorSpace),
    ]).then(([map, bumpMap]) => {
      if (stopped) return;
      clearTimeout(loadTimer);
      material.map = map;
      material.bumpMap = bumpMap;
      material.needsUpdate = true;
      host.dataset.triangles = String(2 * detail[0] * (detail[1] - 1));
      renderer.initTexture(map);
      renderer.initTexture(bumpMap);
      loaded = true;
      refreshIllumination();
    }).catch(() => fail("texture-error"));
  } catch {
    fail("initialization-error");
  }

  return dispose;
}
