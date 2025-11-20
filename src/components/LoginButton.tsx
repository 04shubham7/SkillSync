"use client";

import { signIn } from "next-auth/react";
import { LogIn } from "lucide-react";
import { motion } from "framer-motion";

function LoginButton() {
  return (
    <motion.button
      onClick={() => signIn("google")}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg border border-blue-400/30"
    >
      <LogIn className="w-4 h-4 transition-transform" />
      <span className="max-sm:hidden">Sign In</span>
    </motion.button>
  );
}

export default LoginButton;
