"use client";

// Convex has been removed; provide a passthrough provider so components
// that import this file keep working without runtime Convex code.
function ConvexProviderWithAuth({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default ConvexProviderWithAuth;
