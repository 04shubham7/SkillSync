"use client";

import React, { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, OrbitControls } from "@react-three/drei";
import type { Mesh } from "three";

function AntigravityOrb() {
  const sphereRef = useRef<Mesh | null>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
      <mesh ref={sphereRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* @ts-expect-error - Drei/Fiber typing mismatch */}
        <MeshDistortMaterial
          color="#8b5cf6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function Controls() {
  const { gl } = useThree();
  // @ts-expect-error - Drei/Fiber typing mismatch
  return <OrbitControls domElement={gl.domElement} enableZoom={false} autoRotate autoRotateSpeed={0.5} />;
}

export default function HeroCanvas() {
  return (
    <Canvas className="w-full h-full" camera={{ position: [0, 0, 5], fov: 45 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#c4b5fd" />
      <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />

      {/* Background space elements */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />

      {/* The core 'Antigravity' entity */}
      <AntigravityOrb />

      <Controls />
    </Canvas>
  );
}
