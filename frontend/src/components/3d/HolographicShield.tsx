"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HolographicShield() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 7;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold all 3D shield parts
    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // 1. Create Shield Shape
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.8);
    shieldShape.quadraticCurveTo(1.4, 1.8, 1.5, 0.7);
    shieldShape.quadraticCurveTo(1.6, -0.6, 0, -2.0);
    shieldShape.quadraticCurveTo(-1.6, -0.6, -1.5, 0.7);
    shieldShape.quadraticCurveTo(-1.4, 1.8, 0, 1.8);

    const extrudeSettings = {
      depth: 0.25,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 0.1,
      bevelThickness: 0.1,
    };

    const geometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    geometry.center();

    // Custom glowing material
    const shieldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4, // Electric cyan
      emissive: 0x082f49,
      roughness: 0.15,
      metalness: 0.85,
      transmission: 0.6,
      ior: 1.5,
      transparent: true,
      opacity: 0.9,
      wireframe: false,
    });

    const shieldMesh = new THREE.Mesh(geometry, shieldMaterial);
    shieldGroup.add(shieldMesh);

    // Wireframe Overlay on Shield
    const wireframeGeo = new THREE.WireframeGeometry(geometry);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x8b5cf6, // Violet accent
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.LineSegments(wireframeGeo, wireframeMat);
    shieldGroup.add(wireframe);

    // 2. Futuristic Outer Concentric Rings (Defense Rings)
    const ringGeo1 = new THREE.TorusGeometry(2.3, 0.02, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f2fe, transparent: true, opacity: 0.6 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 2.3;
    shieldGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(2.6, 0.015, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, transparent: true, opacity: 0.45 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 6;
    shieldGroup.add(ring2);

    // 3. Floating Cyber Particle Nebula
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 8;
      posArray[i + 1] = (Math.random() - 0.5) * 8;
      posArray[i + 2] = (Math.random() - 0.5) * 6;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.8,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Dramatic Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const cyanLight = new THREE.PointLight(0x00f2fe, 5, 20);
    cyanLight.position.set(3, 4, 4);
    scene.add(cyanLight);

    const violetLight = new THREE.PointLight(0xa855f7, 4.5, 20);
    violetLight.position.set(-3, -3, 3);
    scene.add(violetLight);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / width) * 2 - 1;
      mouseY = -(((event.clientY - rect.top) / height) * 2 - 1);
    };

    window.addEventListener("mousemove", onMouseMove);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow interpolation
      targetX += (mouseX * 0.45 - targetX) * 0.05;
      targetY += (mouseY * 0.35 - targetY) * 0.05;

      shieldGroup.rotation.y = targetX + Math.sin(elapsedTime * 0.6) * 0.15;
      shieldGroup.rotation.x = -targetY + Math.cos(elapsedTime * 0.5) * 0.08;

      // Rotate orbit defense rings
      ring1.rotation.z += 0.008;
      ring2.rotation.z -= 0.006;

      // Float particles slowly
      particles.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      geometry.dispose();
      shieldMaterial.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[480px] flex items-center justify-center">
      {/* Background radial cyber glow */}
      <div className="absolute inset-0 bg-radial from-cyan-500/15 via-violet-600/10 to-transparent blur-3xl pointer-events-none" />

      {/* Holographic 3D WebGL Canvas */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating Status Ring Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-cyan-500/30 backdrop-blur-md shadow-lg shadow-cyan-500/10">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
        </span>
        <span className="text-xs font-mono text-cyan-300 font-medium">HOLOGRAPHIC DEFENSE RADAR ACTIVE</span>
      </div>
    </div>
  );
}
