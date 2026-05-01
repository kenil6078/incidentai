import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Protected from "./Protected";
import ScrollToTop from "../components/ScrollToTop";

// Lazy loading features
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
const Pricing = lazy(() => import("../features/public/pages/Pricing"));
const NotFound = lazy(() => import("../features/public/pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

function RootLayout() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
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
        path: "/pricing",
        element: <Pricing />,
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
        path: "/incidents/new",
        element: <Protected><CreateIncident /></Protected>,
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
        element: <Protected><Billing /></Protected>,
      },
      {
        path: "/settings",
        element: <Protected><Settings /></Protected>,
      },
      {
        path: "*",
        element: <NotFound />,
      }
    ]
  }
]);

