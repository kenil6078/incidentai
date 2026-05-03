import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Protected from "./Protected";
import ScrollToTop from "../components/ScrollToTop";
import ClickSpark from "../components/ClickSpark";

import { Skeleton } from "../components/ui/skeleton";

// Lazy load pages for better performance
const Landing = lazy(() => import("../features/public/pages/Landing"));
const Login = lazy(() => import("../features/auth/pages/Login"));
const Register = lazy(() => import("../features/auth/pages/Register"));
const Dashboard = lazy(() => import("../features/analytics/pages/Dashboard"));
const IncidentsList = lazy(() => import("../features/incident/pages/IncidentsList"));
const IncidentDetail = lazy(() => import("../features/incident/pages/IncidentDetail"));
const CreateIncident = lazy(() => import("../features/incident/pages/CreateIncident"));
const Team = lazy(() => import("../features/team/pages/Team"));
const Analytics = lazy(() => import("../features/analytics/pages/Analytics"));
const Services = lazy(() => import("../features/services/pages/Services"));
const Billing = lazy(() => import("../features/billing/pages/Billing"));
const Settings = lazy(() => import("../features/settings/pages/Settings"));
const PublicStatus = lazy(() => import("../features/public/pages/PublicStatus"));
const NotFound = lazy(() => import("../features/public/pages/NotFound"));
const Pricing = lazy(() => import("../features/public/pages/Pricing"));
const SuperAdminDashboard = lazy(() => import("../features/admin/pages/SuperAdminDashboard"));
const VerifyEmail = lazy(() => import("../features/auth/pages/VerifyEmail"));
const CompleteProfile = lazy(() => import("../features/auth/pages/CompleteProfile"));
const ChatPage = lazy(() => import("../features/chat/pages/ChatPage"));

function PageLoader() {
  return (
    <div className="p-8 space-y-8 min-h-screen bg-[#FAFAFA]">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48 border-2 border-black" />
        <div className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-none border-2 border-black" />
          <Skeleton className="h-10 w-32 rounded-none border-2 border-black" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Skeleton className="h-32 border-2 border-black neo-shadow" />
        <Skeleton className="h-32 border-2 border-black neo-shadow" />
        <Skeleton className="h-32 border-2 border-black neo-shadow" />
      </div>
      <Skeleton className="h-[400px] w-full border-2 border-black neo-shadow" />
    </div>
  );
}

function RootLayout() {
  return (
    <ClickSpark
      sparkColor="#FF6B6B"
      sparkSize={20}
      sparkRadius={30}
      sparkCount={12}
      duration={400}
    >
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </ClickSpark>
  );
}

export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Landing />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/verify-email/:token",
        element: <VerifyEmail/>,
      },
      {
        path: "/pricing",
        element: <Pricing />,
      },
      {
        path: "/complete-profile",
        element: <Protected><CompleteProfile /></Protected>,
      },
      {
        path: "/status/:orgSlug",
        element: <PublicStatus />,
      },
      {
        path: "/dashboard",
        element: <Protected><Dashboard /></Protected>,
      },
      {
        path: "/incidents",
        element: <Protected><IncidentsList /></Protected>,
      },
      {
        path: "/chats",
        element: <Protected><ChatPage /></Protected>,
      },
      {
        path: "/incidents/new",
        element: <Protected allowedRoles={['admin']}><CreateIncident /></Protected>,
      },
      {
        path: "/incidents/:id",
        element: <Protected><IncidentDetail /></Protected>,
      },
      {
        path: "/team",
        element: <Protected><Team /></Protected>,
      },
      {
        path: "/services",
        element: <Protected><Services /></Protected>,
      },
      {
        path: "/analytics",
        element: <Protected><Analytics /></Protected>,
      },
      {
        path: "/billing",
        element: <Protected allowedRoles={['admin', 'super_admin']}><Billing /></Protected>,
      },
      {
        path: "/settings",
        element: <Protected><Settings /></Protected>,
      },
      {
        path: "/admin",
        element: <Protected><SuperAdminDashboard /></Protected>,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ]
  }
]);

