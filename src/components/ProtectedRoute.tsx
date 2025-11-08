// src/components/ProtectedRoute.tsx

import { useAuth } from "@/hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

// Tampilan loading sederhana
const FullPageLoader = () => (
  <div className="flex min-h-screen items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-64" />
    </div>
  </div>
);

export const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!user) {
    // Jika tidak ada user, redirect ke halaman login
    return <Navigate to="/login" replace />;
  }

  // Jika ada user, tampilkan konten halaman (melalui <Outlet />)
  return <Outlet />;
};