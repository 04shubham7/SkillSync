"use client";

import { motion } from "framer-motion";
import React from "react";
import { Canvas } from "@react-three/fiber";
import { Torus } from "@react-three/drei";

export default function Hero() {
  return (
    <section className="w-full flex items-center justify-center py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-2xl"
          >
            <h1 className="text-4xl font-bold mb-4">CodeScreen — Collaborative technical interviews</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Real-time video, collaborative code editing and structured feedback — all in one place.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card p-4 rounded-2xl h-72 flex items-center justify-center"
          >
            <Canvas className="w-full h-full">
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <Torus args={[1, 0.4, 16, 100]} rotation={[0, 0, 0]}>
                <meshStandardMaterial color="#7C3AED" metalness={0.6} roughness={0.2} />
              </Torus>
            </Canvas>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
