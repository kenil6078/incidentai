import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import AppShell from "./components/AppShell";
import ScrollToTop from "./components/ScrollToTop";
import { Skeleton } from "./components/ui/skeleton";

const Landing = React.lazy(() => import("./pages/Landing"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const IncidentsList = React.lazy(() => import("./pages/IncidentsList"));
const IncidentDetail = React.lazy(() => import("./pages/IncidentDetail"));
const CreateIncident = React.lazy(() => import("./pages/CreateIncident"));
const Team = React.lazy(() => import("./pages/Team"));
const Analytics = React.lazy(() => import("./pages/Analytics"));
const Services = React.lazy(() => import("./pages/Services"));
const Billing = React.lazy(() => import("./pages/Billing"));
const Settings = React.lazy(() => import("./pages/Settings"));
const PublicStatus = React.lazy(() => import("./pages/PublicStatus"));
const NotFound = React.lazy(() => import("./pages/NotFound"));
const Pricing = React.lazy(() => import("./pages/Pricing"));

function PageLoader() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-10 w-1/4" />
      <div className="grid grid-cols-3 gap-6">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex flex-col p-6 space-y-4"><Skeleton className="h-8 w-1/3" /><Skeleton className="h-full w-full" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  return <SocketProvider><AppShell>{children}</AppShell></SocketProvider>;
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ScrollToTop />
        <AuthProvider>
          <Toaster position="top-right" richColors closeButton />
          <React.Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/status/:orgSlug" element={<PublicStatus />} />

              <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
              <Route path="/incidents" element={<PrivateRoute><IncidentsList /></PrivateRoute>} />
              <Route path="/incidents/new" element={<PrivateRoute><CreateIncident /></PrivateRoute>} />
              <Route path="/incidents/:id" element={<PrivateRoute><IncidentDetail /></PrivateRoute>} />
              <Route path="/team" element={<PrivateRoute><Team /></PrivateRoute>} />
              <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
              <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
              <Route path="/billing" element={<PrivateRoute><Billing /></PrivateRoute>} />
              <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

              {/* 404 handler */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </React.Suspense>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;