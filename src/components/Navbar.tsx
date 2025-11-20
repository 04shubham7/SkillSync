"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import DasboardBtn from "./DasboardBtn";
import LoginButton from "./LoginButton";
import { Blocks, LogOut, Calendar, Video, Clock } from "lucide-react";
import { Button } from "./ui/button";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

function Navbar() {
  const { data: session, status } = useSession();

  // Type assertion to use our custom session type with role
  const typedSession = session as any;

  return (
    <motion.nav
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
      className="w-full mb-4"
    >
      <div className="glass-bar flex flex-row items-center justify-between w-full px-4 md:px-8 py-5 gap-4">
        {/* LEFT SIDE - LOGO */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative shrink-0">
          {/* Hover Effect Background */}
          <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500/0 via-purple-500/0 to-indigo-500/0 group-hover:from-blue-500/15 group-hover:via-purple-500/10 group-hover:to-indigo-500/15 opacity-0 group-hover:opacity-100 transition-all duration-400 blur-lg" />

          {/* Logo Icon */}
          <motion.div whileHover={{ scale: 1.05, rotate: 0 }} whileTap={{ scale: 0.95 }}
            className="relative p-1.5 sm:p-2 rounded-xl ring-1 ring-white/10 bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/40 group-hover:ring-blue-400/30 transition-all duration-300 shadow-inner"
          >
            <Blocks className="size-5 md:size-6 text-blue-400 drop-shadow-[0_2px_6px_rgba(59,130,246,0.6)] group-hover:drop-shadow-[0_2px_10px_rgba(99,102,241,0.55)] transition-all duration-300" />
          </motion.div>

          {/* Brand Text */}
          <div className="flex flex-col leading-tight">
            <span className="text-lg md:text-xl font-bold tracking-tight bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 text-transparent bg-clip-text group-hover:brightness-110 transition-all">
              SkillSync
            </span>
            <span className="hidden md:block text-[11px] font-medium text-blue-300/70 group-hover:text-blue-200/90 whitespace-nowrap transition-colors">
              Sync Skills • Ace Interviews
            </span>
          </div>
        </Link>

        {/* CENTER - NAVIGATION MENU */}
        <div className="hidden lg:flex items-center gap-1 mx-auto">
          <Link 
            href="/schedule" 
            className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Calendar className="w-4 h-4 text-blue-400 relative z-10" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white relative z-10">Schedule</span>
          </Link>
          <Link 
            href="/recordings" 
            className="group flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Video className="w-4 h-4 text-purple-400 relative z-10" />
            <span className="text-sm font-medium text-zinc-300 group-hover:text-white relative z-10">Recordings</span>
          </Link>
          
          {/* Feature Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 ml-2">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-xs font-semibold text-blue-300">Real-time Sync</span>
          </div>
        </div>

        {/* RIGHT SIDE - NAVIGATION & AUTH */}
  <div className="flex items-center justify-end gap-2 sm:gap-4 shrink-0">
          {/* Auth Section */}
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse bg-gray-200 rounded-full" />
          ) : typedSession ? (
              <div className="flex items-center gap-2">
              {/* Dashboard Button for Interviewers */}
              {typedSession.user?.role === "interviewer" && <DasboardBtn />}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-9 w-9 rounded-full hover:bg-blue-500/10 focus-visible:ring-2 focus-visible:ring-blue-400/40 transition"
                  >
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={typedSession.user?.image || undefined}
                        alt={typedSession.user?.name || "User"}
                      />
                      <AvatarFallback>
                        {typedSession.user?.name?.charAt(0) || "U"}
                      </AvatarFallback>
                      </Avatar>
                    </motion.div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {typedSession.user?.name || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {typedSession.user?.email || "No email"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground capitalize">
                        {typedSession.user?.role || "Unknown"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
