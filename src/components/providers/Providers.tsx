"use client";

import { SessionProvider, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import StreamProvider from './StreamProvider';
import StreamVideoProvider from './StreamClientProvider';
import { ThemeProvider } from "./ThemeProvider";
import { Toaster } from "react-hot-toast";

function RoleRedirect({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "loading") return;

    // If user is authenticated but doesn't have a role and not already on role selection page
    if (
      session?.user &&
      !(session.user as any).role &&
      pathname !== "/auth/role-selection" &&
      !pathname.startsWith("/auth/signin")
    ) {
      router.push("/auth/role-selection");
    }
  }, [session, status, router, pathname]);

  return <>{children}</>;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        forcedTheme="dark"
        disableTransitionOnChange
      >
        <StreamProvider>
          <StreamVideoProvider>
            <RoleRedirect>{children}</RoleRedirect>
            <Toaster />
          </StreamVideoProvider>
        </StreamProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
