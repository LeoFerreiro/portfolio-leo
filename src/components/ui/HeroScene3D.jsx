import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

function HeroScene3D() {
  const mountRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    let renderer;
    let animationFrame;
    let stopped = false;
    const resources = new Set();
    const createResource = (Constructor, ...args) => {
      const resource = new Constructor(...args);
      resources.add(resource);
      return resource;
    };
    const cleanup = () => {
      if (stopped) return;
      stopped = true;
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", handlePointerMove);
      renderer?.domElement.removeEventListener("webglcontextlost", handleContextLost);
      renderer?.domElement.remove();
      resources.forEach((resource) => resource.dispose());
      renderer?.dispose();
    };
    const fail = () => {
      cleanup();
      setFailed(true);
    };
    const handleContextLost = (event) => {
      event.preventDefault();
      fail();
    };
    let resize;
    let handlePointerMove;

    try {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
      camera.position.set(0, 0, 7);

      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost);
      mount.appendChild(renderer.domElement);

      const group = new THREE.Group();
      scene.add(group);

      const core = new THREE.Mesh(
        createResource(THREE.IcosahedronGeometry, 1.25, 2),
        createResource(THREE.MeshStandardMaterial, {
          color: "#22d3ee",
          emissive: "#2563eb",
          emissiveIntensity: 0.25,
          metalness: 0.55,
          roughness: 0.28,
          transparent: true,
          opacity: 0.92,
        })
      );
      group.add(core);

      const wire = new THREE.Mesh(
        createResource(THREE.IcosahedronGeometry, 1.72, 1),
        createResource(THREE.MeshBasicMaterial, {
          color: "#a78bfa",
          wireframe: true,
          transparent: true,
          opacity: 0.45,
        })
      );
      group.add(wire);

      const ringMaterial = createResource(THREE.MeshBasicMaterial, {
        color: "#38bdf8",
        transparent: true,
        opacity: 0.55,
        side: THREE.DoubleSide,
      });

      const ringA = new THREE.Mesh(
        createResource(THREE.TorusGeometry, 2.25, 0.012, 8, 96),
        ringMaterial
      );
      ringA.rotation.x = Math.PI / 2.7;
      group.add(ringA);

      const ringB = new THREE.Mesh(
        createResource(THREE.TorusGeometry, 2.75, 0.01, 8, 96),
        ringMaterial.clone()
      );
      resources.add(ringB.material);
      ringB.material.color.set("#8b5cf6");
      ringB.rotation.y = Math.PI / 2.5;
      group.add(ringB);

      const particlesGeometry = createResource(THREE.BufferGeometry);
      const particleCount = 90;
      const positions = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount; i += 1) {
        const radius = 2.6 + Math.random() * 2.3;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 3.5;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = height;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }

      particlesGeometry.setAttribute(
        "position",
        new THREE.BufferAttribute(positions, 3)
      );

      const particles = new THREE.Points(
        particlesGeometry,
        createResource(THREE.PointsMaterial, {
          color: "#bfdbfe",
          size: 0.035,
          transparent: true,
          opacity: 0.75,
        })
      );
      group.add(particles);

      scene.add(new THREE.AmbientLight("#dbeafe", 0.8));

      const blueLight = new THREE.PointLight("#38bdf8", 16, 18);
      blueLight.position.set(-4, 3, 5);
      scene.add(blueLight);

      const violetLight = new THREE.PointLight("#8b5cf6", 18, 18);
      violetLight.position.set(4, -2, 4);
      scene.add(violetLight);

      const pointer = { x: 0, y: 0 };
      const clock = new THREE.Clock();

      resize = () => {
        if (stopped) return;
        try {
          const { clientWidth, clientHeight } = mount;
          if (!clientWidth || !clientHeight) return;
          renderer.setSize(clientWidth, clientHeight);
          camera.aspect = clientWidth / clientHeight;
          camera.updateProjectionMatrix();
        } catch {
          fail();
        }
      };

      handlePointerMove = (event) => {
        const rect = mount.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      };

      const animate = () => {
        if (stopped) return;
        try {
          const elapsed = clock.getElapsedTime();

          if (!prefersReducedMotion) {
            group.rotation.y = elapsed * 0.18 + pointer.x * 0.12;
            group.rotation.x = Math.sin(elapsed * 0.45) * 0.1 + pointer.y * 0.08;
            wire.rotation.y = -elapsed * 0.24;
            ringA.rotation.z = elapsed * 0.32;
            ringB.rotation.x = elapsed * 0.22;
            particles.rotation.y = elapsed * 0.08;
          }

          renderer.render(scene, camera);
          animationFrame = requestAnimationFrame(animate);
        } catch {
          fail();
        }
      };

      window.addEventListener("resize", resize);
      mount.addEventListener("pointermove", handlePointerMove);
      resize();
      animate();

    } catch {
      fail();
    }

    return cleanup;
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-3d-scene"
      aria-hidden="true"
    >
      {failed && (
        <svg viewBox="0 0 400 400" width="100%" height="100%" focusable="false">
          <circle cx="200" cy="200" r="85" fill="#2563eb" fillOpacity="0.3" stroke="#22d3ee" />
          <ellipse cx="200" cy="200" rx="150" ry="60" fill="none" stroke="#38bdf8" transform="rotate(-25 200 200)" />
          <ellipse cx="200" cy="200" rx="150" ry="60" fill="none" stroke="#8b5cf6" transform="rotate(65 200 200)" />
        </svg>
      )}
    </div>
  );
}

export default HeroScene3D;
