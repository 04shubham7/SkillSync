"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import MeetingModal from "@/components/MeetingModal";
import {
  Loader2Icon,
  LogIn,
  Code2,
  Users,
  Calendar,
  Clock,
} from "lucide-react";
import MeetingCard from "@/components/MeetingCard";
import { useSession, signIn } from "next-auth/react";
import { motion, useInView, useAnimation } from "framer-motion";
import LoaderUI from "@/components/LoaderUI";
import SpotlightCard from "@/components/ui/SpotlightCard";
import Hero from "@/components/Hero";
import JoinByCodeCard from "@/components/JoinByCodeCard";
import Laptop3D from "@/components/Laptop3D";

// Custom hook for scroll animations
const useScrollAnimation = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return { ref, controls };
};

// Component for signed-in functionality
function SignedInContent() {
  const router = useRouter();
  const { status } = useSession();
  const { isInterviewer, isLoading } = useUserRole();
  const [interviews, setInterviews] = useState<any[] | null>(null);
  const [loadingInterviews, setLoadingInterviews] = useState(false);

  useEffect(() => {
    if (status !== 'authenticated') return;
    let cancelled = false;
    const load = async () => {
      setLoadingInterviews(true);
      try {
        const res = await fetch('/api/interviews');
        if (!res.ok) throw new Error('Failed to load interviews');
        const data = await res.json();
        if (!cancelled) setInterviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        if (!cancelled) setInterviews([]);
      } finally {
        if (!cancelled) setLoadingInterviews(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [status]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"start" | "join">();

  const handleQuickAction = (title: string) => {
    switch (title) {
      case "New Call":
        setModalType("start");
        setShowModal(true);
        break;
      case "Join Interview":
        setModalType("join");
        setShowModal(true);
        break;
      default:
        router.push(`/${title.toLowerCase()}`);
    }
  };

  // If user is not signed in, show interviewer UI with login prompts
  if (status !== "authenticated") {
    return (
      <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* New Call */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(30, 60, 114, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => handleQuickAction("New Call")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                  }}
                >
                  <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-start drop-shadow-sm">
                New Call
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 text-start font-normal">
                Launch instant interview session
              </p>
            </div>
          </SpotlightCard>

          {/* Join Interview */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(66, 39, 90, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => handleQuickAction("Join Interview")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #42275a, #734b6d)",
                  }}
                >
                  <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-start drop-shadow-sm">
                Join Interview
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 text-start font-normal">
                Connect with your invite link
              </p>
            </div>
          </SpotlightCard>

          {/* Join by Code */}
          <JoinByCodeCard />

          {/* Schedule */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(19, 78, 74, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => router.push("/schedule")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #134e4a, #2dd4bf)",
                  }}
                >
                  <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-start drop-shadow-sm">
                Schedule
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 text-start font-normal">
                Smart interview scheduling
              </p>
            </div>
          </SpotlightCard>

          {/* Recordings */}
          <SpotlightCard
            className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
            spotlightColor="rgba(40, 62, 81, 0.6)"
          >
            <div
              className="w-full h-full flex flex-col justify-between cursor-pointer"
              style={{ minHeight: "100%" }}
              onClick={() => router.push("/recordings")}
            >
              <div className="flex items-start justify-start mb-6">
                <div
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                  style={{
                    background: "linear-gradient(135deg, #283E51, #485563)",
                  }}
                >
                  <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-2 text-start drop-shadow-sm">
                Recordings
              </h3>
              <p className="text-sm sm:text-base text-zinc-300 text-start font-normal">
                Review & analyze sessions
              </p>
            </div>
          </SpotlightCard>
        </div>
      </div>
    );
  }

  // If user is signed in but still loading
  if (isLoading) return <LoaderUI />;

  return (
    <div className="flex flex-col gap-10 px-4 sm:px-6 lg:px-8">
      {isInterviewer ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* New Call */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(30, 60, 114, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => handleQuickAction("New Call")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #1e3c72, #2a5298)",
                    }}
                  >
                    <Code2 className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  New Call
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Start an instant call
                </p>
              </div>
            </SpotlightCard>

            {/* Join Interview */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(66, 39, 90, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => handleQuickAction("Join Interview")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #42275a, #734b6d)",
                    }}
                  >
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  Join Interview
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Enter via invitation link
                </p>
              </div>
            </SpotlightCard>

            {/* Join by Code */}
            <JoinByCodeCard />

            {/* Schedule */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(19, 78, 74, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => router.push("/schedule")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #134e4a, #2dd4bf)",
                    }}
                  >
                    <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  Schedule
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Plan upcoming interviews
                </p>
              </div>
            </SpotlightCard>

            {/* Recordings */}
            <SpotlightCard
              className="h-full w-full cursor-pointer flex flex-col justify-start items-start p-4 md:p-8 bg-white/5 shadow-xl backdrop-blur-md transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl group-hover:border-blue-400/40 group-hover:bg-white/10 dark:border-neutral-800"
              spotlightColor="rgba(40, 62, 81, 0.6)"
            >
              <div
                className="w-full h-full flex flex-col justify-between cursor-pointer"
                style={{ minHeight: "100%" }}
                onClick={() => router.push("/recordings")}
              >
                <div className="flex items-start justify-start mb-6">
                  <div
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-gradient-to-br from-white/10 to-white/5 border border-white/20 group-hover:from-blue-400/30 group-hover:to-blue-600/20 transition-all duration-300 shadow-md"
                    style={{
                      background: "linear-gradient(135deg, #283E51, #485563)",
                    }}
                  >
                    <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black dark:text-white mb-2 text-start drop-shadow-sm">
                  Recordings
                </h3>
                <p className="text-sm sm:text-base text-black dark:text-white/80 text-start font-normal">
                  Access past interviews
                </p>
              </div>
            </SpotlightCard>
          </div>

          <MeetingModal
            isOpen={showModal}
            onClose={() => setShowModal(false)}
            title={modalType === "join" ? "Join Meeting" : "Start Meeting"}
            isJoinMeeting={modalType === "join"}
          />
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl font-bold">Your Interviews</h1>
            <p className="text-muted-foreground mt-1">
              View and join your scheduled interviews
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8"
          >
            {loadingInterviews || interviews === null ? (
              <div className="flex justify-center py-12">
                <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : interviews.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {interviews.map((interview) => (
                  <div
                    key={interview.id}
                    className="h-full w-full cursor-pointer"
                  >
                    <MeetingCard interview={interview} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                You have no scheduled interviews at the moment
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}

export default function Home() {
  const { status } = useSession();

  // Animation variants
  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  // Get animation controls
  const statsAnimation = useScrollAnimation();

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Hero />
      {/* Background Grid */}
      {/* <div className="fixed inset-0 -z-10">
                <div className="absolute inset-0 bg-zinc-900" />
                <div className="absolute inset-0 bg-[linear-gradient(#1f1f1f_1px,transparent_1px),linear-gradient(90deg,#1f1f1f_1px,transparent_1px)] bg-[size:20px_20px]" />
            </div> */}

      <section className="relative z-10 pt-8 pb-10 px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative">
            {/* Left Content */}
            <motion.div
              className="lg:col-span-7 space-y-8"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                <motion.div
                  className="text-white drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  Welcome to
                </motion.div>
                <motion.div
                  className="bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_4px_20px_rgba(99,102,241,0.8)]"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  SkillSync
                </motion.div>
                <motion.div
                  className="pt-2 text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  Your all-in-one
                </motion.div>
                <motion.div
                  className="pt-2 text-3xl md:text-4xl lg:text-5xl text-white drop-shadow-lg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
                >
                  Technical Interview{" "}
                  <span className="bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">Platform</span>
                </motion.div>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-zinc-200 max-w-xl drop-shadow-md leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1.0] }}
              >
                Streamline your technical hiring with real-time collaborative coding,
                video interviews, and smart scheduling. Sync skills across your team
                with multi-language support and instant feedback loops.
              </motion.p>

              {/* Stats */}
              <motion.div
                ref={statsAnimation.ref}
                variants={fadeInUpVariants}
                initial=""
                animate={statsAnimation.controls}
                className="flex flex-row items-center gap-4 xs:gap-6 sm:gap-8 text-xs sm:text-sm text-zinc-400 dark:text-zinc-400"
              >
                {/* Real-time Collaboration */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[80px]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
                    <span className="animate-pulse">⚡</span>
                  </div>
                  <div className="uppercase text-[10px] sm:text-xs ">
                    Real-time Sync
                  </div>
                </div>

                {/* Languages Supported */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[80px]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
                    10+
                  </div>
                  <div className="uppercase text-[10px] sm:text-xs ">
                    Languages
                  </div>
                </div>

                {/* HD Recording */}
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left min-w-[80px]">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-400">
                    HD
                  </div>
                  <div className="uppercase text-[10px] sm:text-xs ">
                    Recording
                  </div>
                </div>
              </motion.div>

              {/* CTA Button - Show for signed out users */}
              {status !== "authenticated" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <button
                    onClick={() => signIn("google")}
                    className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg"
                  >
                    <LogIn className="w-4 h-4 transition-transform" />
                    <span className="max-sm:hidden">Get Started!</span>
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Right Content (3D Laptop) — hidden on small screens */}
            <motion.div
              className="absolute right-0 hidden lg:flex lg:col-span-5 justify-center items-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              <motion.div
                className="relative w-[450px] h-[450px] xl:w-[600px] xl:h-[600px]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                  ease: [0.25, 0.1, 0.25, 1.0]
                }}
              >
                <div className="relative overflow-visible w-full h-full">
                  <Laptop3D
                    size={1.2}
                    rotationSpeed={0.3}
                    floatSpeed={0.8}
                    screenGlow={true}
                  />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Show functionality for everyone */}
      <SignedInContent />

      {/* Show sign-in prompt for signed-out users */}
      {status !== "authenticated" && (
        <div className="flex flex-col gap-10 mx-auto container">
          <motion.div
            variants={fadeInUpVariants}
            initial=""
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center py-12"
          >
            <h2 className="text-2xl font-bold mb-4 text-white">Ready to Sync Your Skills?</h2>
            <p className="text-zinc-400 mb-6 max-w-md mx-auto">
              Join SkillSync to schedule interviews, collaborate in real-time,
              and elevate your technical hiring process.
            </p>
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-lg mx-auto"
            >
              <LogIn className="w-4 h-4" />
              Sign In to Continue
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
