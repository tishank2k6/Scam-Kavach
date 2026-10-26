"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { Mail, AlertTriangle, Link as LinkIcon, ShieldCheck } from "lucide-react";

export default function SecurityShield3D() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 440;
    const height = container.clientHeight || 460;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.2);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const shieldGroup = new THREE.Group();
    scene.add(shieldGroup);

    // 1. Realistic Shield Shape Geometry
    const shieldShape = new THREE.Shape();
    shieldShape.moveTo(0, 1.9);
    shieldShape.quadraticCurveTo(1.45, 1.9, 1.5, 0.8);
    shieldShape.quadraticCurveTo(1.55, -0.6, 0, -2.1);
    shieldShape.quadraticCurveTo(-1.55, -0.6, -1.5, 0.8);
    shieldShape.quadraticCurveTo(-1.45, 1.9, 0, 1.9);

    const extrudeSettings = {
      depth: 0.35,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 2,
      bevelSize: 0.18,
      bevelThickness: 0.18,
    };

    const geometry = new THREE.ExtrudeGeometry(shieldShape, extrudeSettings);
    geometry.center();

    // 2. High-Gloss Obsidian / Charcoal Shield Face
    const obsidianMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x11151b,
      emissive: 0x07090d,
      roughness: 0.18,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.95,
    });

    const shieldMesh = new THREE.Mesh(geometry, obsidianMaterial);
    shieldMesh.castShadow = true;
    shieldMesh.receiveShadow = true;
    shieldGroup.add(shieldMesh);

    // 3. Polished Metallic Gold Outer Rim
    const rimShape = new THREE.Shape();
    rimShape.moveTo(0, 1.95);
    rimShape.quadraticCurveTo(1.5, 1.95, 1.55, 0.85);
    rimShape.quadraticCurveTo(1.6, -0.65, 0, -2.2);
    rimShape.quadraticCurveTo(-1.6, -0.65, -1.55, 0.85);
    rimShape.quadraticCurveTo(-1.5, 1.95, 0, 1.95);

    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xffc247, // Golden Yellow
      emissive: 0x78350f, // Warm Amber glow
      metalness: 0.95,
      roughness: 0.22,
    });

    // 4. Central 3D Golden Padlock Emblem
    const padlockGroup = new THREE.Group();
    padlockGroup.position.set(0, 0, 0.32);

    // Padlock body
    const lockBodyGeo = new THREE.BoxGeometry(0.7, 0.6, 0.2);
    const lockBodyMesh = new THREE.Mesh(lockBodyGeo, goldMaterial);
    padlockGroup.add(lockBodyMesh);

    // Padlock shackle (arc)
    const shackleGeo = new THREE.TorusGeometry(0.24, 0.065, 16, 32, Math.PI);
    const shackleMesh = new THREE.Mesh(shackleGeo, goldMaterial);
    shackleMesh.position.set(0, 0.3, 0);
    padlockGroup.add(shackleMesh);

    // Glowing keyhole
    const keyholeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.15, 16);
    const cyanKeyholeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const keyholeMesh = new THREE.Mesh(keyholeGeo, cyanKeyholeMat);
    keyholeMesh.rotation.x = Math.PI / 2;
    keyholeMesh.position.set(0, 0, 0.08);
    padlockGroup.add(keyholeMesh);

    shieldGroup.add(padlockGroup);

    // 5. Dual Concentric Orbit Rings
    const orbitGeometry1 = new THREE.TorusGeometry(2.35, 0.03, 24, 100);
    const orbitMaterial1 = new THREE.MeshStandardMaterial({
      color: 0xffc247,
      metalness: 0.9,
      roughness: 0.3,
      transparent: true,
      opacity: 0.85,
    });
    const ring1 = new THREE.Mesh(orbitGeometry1, orbitMaterial1);
    ring1.rotation.x = Math.PI / 2.3;
    shieldGroup.add(ring1);

    const orbitGeometry2 = new THREE.TorusGeometry(2.7, 0.02, 24, 100);
    const orbitMaterial2 = new THREE.MeshStandardMaterial({
      color: 0x38bdf8, // Sky Blue
      metalness: 0.7,
      roughness: 0.3,
      transparent: true,
      opacity: 0.65,
    });
    const ring2 = new THREE.Mesh(orbitGeometry2, orbitMaterial2);
    ring2.rotation.x = -Math.PI / 2.6;
    ring2.rotation.y = Math.PI / 7;
    shieldGroup.add(ring2);

    // 6. Floating Warm Gold Micro-Particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 7.0;
      posArray[i + 1] = (Math.random() - 0.5) * 7.0;
      posArray[i + 2] = (Math.random() - 0.5) * 5.0;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xffc247,
      transparent: true,
      opacity: 0.65,
    });
    const particleCloud = new THREE.Points(particleGeo, particleMat);
    scene.add(particleCloud);

    // 7. Cinematic Lighting (Golden Key Light + Amber Rim + Sky Blue Backlight)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const goldKeyLight = new THREE.DirectionalLight(0xffc247, 2.5);
    goldKeyLight.position.set(4, 5, 5);
    scene.add(goldKeyLight);

    const blueBackLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    blueBackLight.position.set(-5, -3, -2);
    scene.add(blueBackLight);

    const amberFillLight = new THREE.PointLight(0xf59e0b, 1.8, 10);
    amberFillLight.position.set(0, -2, 3);
    scene.add(amberFillLight);

    // 8. Interactive Cursor Tracking & Animation Loop
    let targetRotY = 0;
    let targetRotX = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      mouseX = x / (rect.width / 2);
      mouseY = y / (rect.height / 2);
      targetRotY = mouseX * 0.45;
      targetRotX = -mouseY * 0.35;
    };

    window.addEventListener("mousemove", handleMouseMove);

    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth damped rotation towards cursor
      shieldGroup.rotation.y += (targetRotY - shieldGroup.rotation.y) * 0.05;
      shieldGroup.rotation.x += (targetRotX - shieldGroup.rotation.x) * 0.05;

      // Gentle floating bob
      shieldGroup.position.y = Math.sin(elapsedTime * 1.5) * 0.09;

      // Orbit rotations
      ring1.rotation.z = elapsedTime * 0.35;
      ring2.rotation.z = -elapsedTime * 0.25;

      // Subtle particle drift
      particleCloud.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full max-w-[460px] h-[460px] flex items-center justify-center select-none">
      {/* Background radial gold glow behind shield */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFC247]/10 via-[#F59E0B]/5 to-[#38BDF8]/10 rounded-full blur-3xl pointer-events-none" />

      {/* 3D Canvas Mount */}
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing z-10" />

      {/* Floating Holographic Card 1: Job Offer (Top-Left) */}
      <div className="absolute -top-1 -left-4 sm:-left-6 z-20 bg-[#11151B]/90 backdrop-blur-md border border-[#18222C] rounded-2xl p-3 shadow-xl shadow-black/50 flex items-center gap-2.5 animate-bounce [animation-duration:4s]">
        <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
          <Mail className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#38BDF8] uppercase tracking-wider block">Job Offer</span>
          <span className="text-xs font-semibold text-[#F5F7FA]">Click here to apply...</span>
        </div>
      </div>

      {/* Floating Holographic Card 2: Scan Alert Critical (Right) */}
      <div className="absolute top-1/3 -right-3 sm:-right-6 z-20 bg-[#11151B]/90 backdrop-blur-md border border-[#FF4D5A]/40 rounded-2xl p-3 shadow-xl shadow-[#FF4D5A]/10 flex items-center gap-2.5 animate-pulse [animation-duration:3s]">
        <div className="w-8 h-8 rounded-xl bg-[#FF4D5A]/20 border border-[#FF4D5A]/40 flex items-center justify-center text-[#FF4D5A]">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#FF4D5A] uppercase tracking-wider block font-bold">Scan Alert</span>
          <span className="text-xs font-bold text-[#F5F7FA]">Critical Threat</span>
        </div>
      </div>

      {/* Floating Holographic Card 3: Suspicious Link (Bottom-Left) */}
      <div className="absolute bottom-4 -left-2 sm:-left-4 z-20 bg-[#11151B]/90 backdrop-blur-md border border-[#F59E0B]/30 rounded-2xl p-3 shadow-xl shadow-black/50 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-[#F59E0B]/15 border border-[#F59E0B]/30 flex items-center justify-center text-[#FFC247]">
          <LinkIcon className="w-4 h-4" />
        </div>
        <div>
          <span className="text-[10px] font-mono text-[#FFC247] uppercase tracking-wider block">Suspicious Link</span>
          <span className="text-xs font-mono text-[#9AA7B5]">https://bit.ly/xyz...</span>
        </div>
      </div>
    </div>
  );
}
