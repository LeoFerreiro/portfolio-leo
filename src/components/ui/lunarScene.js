import * as THREE from "three";

/** A still, demand-rendered moon. This module is loaded only after the Hero is visible. */
export function mountLunarScene(host, { onReady, onError }) {
  const resources = new Set();
  const bitmaps = new Set();
  const abort = new AbortController();
  let renderer;
  let context;
  let resizeObserver;
  let visibilityObserver;
  let frame = null;
  let loadTimer;
  let stopped = false;
  let inView = true;
  let loaded = false;
  let scene;
  let camera;
  let ready = false;
  let shaderFailed = false;

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
    frame = requestAnimationFrame(() => {
      frame = null;
      if (stopped || !inView || document.hidden) return;
      try {
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
      } catch {
        fail("render-error");
      }
    });
  };

  function handleVisibility() {
    if (document.hidden && frame !== null) {
      cancelAnimationFrame(frame);
      frame = null;
    }
    requestRender();
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
      const horizontal = 2 / 0.792;
      const vertical = horizontal * height / width;
      camera.left = -0.52 * horizontal;
      camera.right = 0.48 * horizontal;
      camera.top = 0.51 * vertical;
      camera.bottom = -0.49 * vertical;
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
    renderer.toneMappingExposure = 1.15;
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
      color: 0xd9d9d9,
      roughness: 1,
      metalness: 0,
      bumpScale: 0.025,
    }));
    const moon = new THREE.Mesh(geometry, material);
    // Bring the near-side maria (middle of the equirectangular map) towards the camera.
    moon.rotation.y = -Math.PI / 2;
    moon.rotation.z = -0.08;
    scene.add(moon);

    const sun = new THREE.DirectionalLight(0xf4f2ec, 3.1);
    sun.position.set(-3.5, 1.1, 1.65);
    scene.add(sun);
    scene.add(new THREE.AmbientLight(0xdce1e8, 0.018));

    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(host);
    visibilityObserver = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView && frame !== null) {
        cancelAnimationFrame(frame);
        frame = null;
      }
      requestRender();
    });
    visibilityObserver.observe(host);
    document.addEventListener("visibilitychange", handleVisibility);
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
      requestRender();
    }).catch(() => fail("texture-error"));
  } catch {
    fail("initialization-error");
  }

  return dispose;
}
