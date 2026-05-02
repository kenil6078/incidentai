import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../features/auth/hooks/useAuth";
import { SocketProvider } from "../context/SocketContext";
import AppShell from "../components/AppShell";
import { Skeleton } from "../components/ui/skeleton";

export default function Protected({ children, allowedRoles }) {
  const { user, loading, isInitialized, handleGetMe } = useAuth();
  const location = useLocation();

  React.useEffect(() => {
    if (!isInitialized) {
      handleGetMe();
    }
  }, [isInitialized, handleGetMe]);

  if (loading || !isInitialized) {
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

  // Handle unverified users
  if (user.isVerified === false) {
    return <Navigate to="/login" replace />;
  }

  // Handle incomplete Google Auth profiles
  if (user.profileCompleted === false && location.pathname !== '/complete-profile') {
    return <Navigate to="/complete-profile" replace />;
  }

  // Super Admin restricted access
  if (user.role === 'super_admin' && location.pathname !== '/admin') {
    return <Navigate to="/admin" replace />;
  }

  if (user.role !== 'super_admin' && location.pathname === '/admin') {
    return <Navigate to="/dashboard" replace />;
  }

  // Specific role-based access control
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  if (location.pathname === '/complete-profile') {
    return children; 
  }

  return (
    <SocketProvider>
      <AppShell>{children}</AppShell>
    </SocketProvider>
  );
}
