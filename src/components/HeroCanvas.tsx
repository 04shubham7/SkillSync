"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

function RotatingTorus() {
  const ref = useRef<Mesh | null>(null);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.2;
      ref.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <mesh ref={ref} rotation={[0.7, 0.1, 0]}>
      <torusGeometry args={[1, 0.35, 16, 64]} />
      <meshStandardMaterial color="#7C3AED" metalness={0.6} roughness={0.25} />
    </mesh>
  );
}

export default function HeroCanvas() {
  return (
    <Canvas className="w-full h-full">
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <RotatingTorus />
    </Canvas>
  );
}
