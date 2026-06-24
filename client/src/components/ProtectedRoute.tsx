// "use client";

// import { useAuth } from "@/context/AuthContext";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";

// interface ProtectedRouteProps {
//   children: React.ReactNode;
//   adminOnly?: boolean;
// }

// export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
//   const { user, loading, isAdmin } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!loading) {
//       if (!user) {
//         console.log("No user, redirecting to login");
//         router.push("/login");
//       } else if (adminOnly && !isAdmin) {
//         console.log("Not admin, redirecting to home");
//         router.push("/");
//       }
//     }
//   }, [user, loading, router, adminOnly, isAdmin]);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="text-xl">Loading...</div>
//       </div>
//     );
//   }

//   if (!user) {
//     return null;
//   }

//   if (adminOnly && !isAdmin) {
//     return null;
//   }

//   return <>{children}</>;
// }





"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

// ✅ Shared loading spinner — shown while auth state loads or redirect is in flight
const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600" />
  </div>
);

export default function ProtectedRoute({ children, adminOnly = false }: ProtectedRouteProps) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (adminOnly && !isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, router, adminOnly, isAdmin]);

  // ✅ Show spinner while loading OR while redirect is in flight
  // Prevents blank flash and stops protected content rendering before redirect completes
  if (loading || !user) return <LoadingSpinner />;
  if (adminOnly && !isAdmin) return <LoadingSpinner />;

  return <>{children}</>;
}