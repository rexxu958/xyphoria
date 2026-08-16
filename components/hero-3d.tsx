"use client";

import { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Environment } from "@react-three/drei";
import type { Mesh } from "three";

function Core() {
  const meshRef = useRef<Mesh>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      setPointer({
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2
      });
    }
    window.addEventListener("pointermove", handleMove);
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += delta * 0.15;
    meshRef.current.rotation.x += (pointer.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.z += (pointer.x * 0.15 - meshRef.current.rotation.z) * 0.02;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.3} floatIntensity={0.6}>
      <Sphere ref={meshRef} args={[1.4, 128, 128]}>
        <MeshDistortMaterial
          color="#6C5CE7"
          attach="material"
          distort={0.42}
          speed={1.8}
          roughness={0.15}
          metalness={0.7}
          emissive="#00D9C6"
          emissiveIntensity={0.15}
        />
      </Sphere>
    </Float>
  );
}

function FallbackVisual() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-56 w-56 animate-pulse-slow rounded-full bg-gradient-to-br from-primary to-secondary opacity-60 blur-2xl" />
      <div className="absolute h-40 w-40 animate-float rounded-full border border-primary/40" />
    </div>
  );
}

export default function Hero3D() {
  const [webglSupported, setWebglSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const supported = Boolean(
        window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebglSupported(supported);
    } catch {
      setWebglSupported(false);
    }
  }, []);

  if (webglSupported === false) {
    return <FallbackVisual />;
  }

  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 1.5]}>
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#6C5CE7" />
        <pointLight position={[-5, -5, -5]} intensity={0.8} color="#00D9C6" />
        <Suspense fallback={null}>
          <Core />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
}
