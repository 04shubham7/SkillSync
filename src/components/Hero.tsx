"use client";

import React from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Canvas3DErrorBoundary } from "./Canvas3DErrorBoundary";
import FadeIn from "./motion/FadeIn";
import { motion } from "framer-motion";

const HeroCanvas = dynamic(() => import("./HeroCanvas"), {
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center">Loading...</div>,
});

export default function Hero() {
  return (
    <section className="w-full flex items-center justify-center py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <FadeIn
            delay={0}
            duration={0.6}
            y={20}
            className="glass-surface p-8 rounded-2xl"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text drop-shadow-lg">SkillSync — Collaborative technical interviews</h1>
            <p className="text-lg text-zinc-300 mb-6 leading-relaxed">
              Real-time video, collaborative code editing and structured feedback — all in one place.
            </p>
          </FadeIn>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-surface p-4 rounded-2xl h-72 flex items-center justify-center"
          >
            {/* Desktop/large screens: render 3D canvas (lazy-loaded) */}
            <div className="hidden sm:block w-full h-full">
              <Canvas3DErrorBoundary>
                <HeroCanvas />
              </Canvas3DErrorBoundary>
            </div>

            {/* Mobile fallback: static image for performance */}
            <div className="sm:hidden w-full h-full flex items-center justify-center">
              <Image src="/hero.png" alt="SkillSync Hero" width={600} height={300} className="object-contain" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
