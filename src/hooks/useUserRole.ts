import { useSession } from "next-auth/react";

export const useUserRole = () => {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const role = (session?.user as any)?.role as string | undefined | null;
  const isInterviewer = role === "interviewer";
  const isCandidate = role === "candidate";

  return {
    isLoading,
    isInterviewer,
    isCandidate,
    role,
  };
};
