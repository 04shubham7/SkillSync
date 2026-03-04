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
    <section className="relative w-full min-h-[85vh] flex items-center justify-center py-20 overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <FadeIn
            delay={0.2}
            duration={0.8}
            y={30}
            className="flex flex-col items-start justify-center max-w-2xl mx-auto lg:mx-0"
          >
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-md animate-pulse-slow">
              <span className="flex h-2 w-2 rounded-full bg-indigo-400"></span>
              <span>Powered by Antigravity, the mythical coder</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-600 drop-shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              SkillSync
              <br />
              <span className="text-4xl md:text-5xl mt-2 block text-white/90 font-bold">Collaborative Interviews</span>
            </h1>

            <p className="text-xl text-indigo-100/70 mb-8 leading-relaxed max-w-lg">
              Real-time video, collaborative code editing, and seamless peer feedback. Elevate your technical interviews to a new dimension.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300"
              >
                Start an Interview
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 rounded-xl glass-card text-white font-semibold hover:bg-white/10 transition-colors duration-300"
              >
                Learn More
              </motion.button>
            </div>
          </FadeIn>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, type: "spring" }}
            className="relative lg:h-[600px] flex items-center justify-center animate-float w-full h-[400px]"
          >
            {/* Desktop/large screens: render 3D canvas (lazy-loaded) */}
            <div className="hidden sm:block w-full h-full relative z-20">
              <Canvas3DErrorBoundary>
                <HeroCanvas />
              </Canvas3DErrorBoundary>
            </div>

            {/* Glowing backdrop for the 3D element */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-indigo-500/20 rounded-full blur-[100px] z-0 pointer-events-none"></div>

            {/* Mobile fallback: static image for performance */}
            <div className="sm:hidden w-full h-full flex items-center justify-center relative z-20">
              <Image src="/hero.png" alt="SkillSync Hero" width={400} height={400} className="object-contain drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
