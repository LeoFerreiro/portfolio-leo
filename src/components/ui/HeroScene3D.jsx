import { useEffect, useRef } from "react";
import * as THREE from "three";

function HeroScene3D() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.set(0, 0, 7);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.25, 2),
      new THREE.MeshStandardMaterial({
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
      new THREE.IcosahedronGeometry(1.72, 1),
      new THREE.MeshBasicMaterial({
        color: "#a78bfa",
        wireframe: true,
        transparent: true,
        opacity: 0.45,
      })
    );
    group.add(wire);

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: "#38bdf8",
      transparent: true,
      opacity: 0.55,
      side: THREE.DoubleSide,
    });

    const ringA = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.012, 8, 96),
      ringMaterial
    );
    ringA.rotation.x = Math.PI / 2.7;
    group.add(ringA);

    const ringB = new THREE.Mesh(
      new THREE.TorusGeometry(2.75, 0.01, 8, 96),
      ringMaterial.clone()
    );
    ringB.material.color.set("#8b5cf6");
    ringB.rotation.y = Math.PI / 2.5;
    group.add(ringB);

    const particlesGeometry = new THREE.BufferGeometry();
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
      new THREE.PointsMaterial({
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
    let animationFrame;

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };

    const handlePointerMove = (event) => {
      const rect = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const animate = () => {
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
    };

    resize();
    animate();
    window.addEventListener("resize", resize);
    mount.addEventListener("pointermove", handlePointerMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("pointermove", handlePointerMove);
      mount.removeChild(renderer.domElement);
      particlesGeometry.dispose();
      core.geometry.dispose();
      core.material.dispose();
      wire.geometry.dispose();
      wire.material.dispose();
      ringA.geometry.dispose();
      ringA.material.dispose();
      ringB.geometry.dispose();
      ringB.material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="hero-3d-scene"
      aria-hidden="true"
    />
  );
}

export default HeroScene3D;
