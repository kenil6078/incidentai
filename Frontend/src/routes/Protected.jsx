import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { SocketProvider } from "../context/SocketContext";
import AppShell from "../components/AppShell";
import { Skeleton } from "../components/ui/skeleton";

export default function Protected({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-full w-full" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <SocketProvider>
      <AppShell>{children}</AppShell>
    </SocketProvider>
  );
}
