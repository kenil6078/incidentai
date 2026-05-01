import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import Protected from "./Protected";
import ScrollToTop from "../components/ScrollToTop";

import Landing from "../features/public/pages/Landing";
import Login from "../features/auth/pages/Login";
import Register from "../features/auth/pages/Register";
import Dashboard from "../features/analytics/pages/Dashboard";
import IncidentsList from "../features/incident/pages/IncidentsList";
import IncidentDetail from "../features/incident/pages/IncidentDetail";
import CreateIncident from "../features/incident/pages/CreateIncident";
import Team from "../features/team/pages/Team";
import Analytics from "../features/analytics/pages/Analytics";
import Services from "../features/services/pages/Services";
import Billing from "../features/billing/pages/Billing";
import Settings from "../features/settings/pages/Settings";
import PublicStatus from "../features/public/pages/PublicStatus";
import NotFound from "../features/public/pages/NotFound";
import Pricing from "../features/public/pages/Pricing";

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
        path: "/verify-email/:token",
        element: <VerifyEmail />,
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

