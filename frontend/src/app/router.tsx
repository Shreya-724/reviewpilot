import { createBrowserRouter, Navigate } from "react-router-dom";

import { AppLayout } from "../components/layout/AppLayout";
import { LoginPage } from "../features/auth/LoginPage";
import { RegisterPage } from "../features/auth/RegisterPage";
import { ProtectedRoute, PublicOnlyRoute } from "../features/auth/RouteGuards";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { LandingPage } from "../pages/LandingPage";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  {
    element: <PublicOnlyRoute />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [{ path: "/dashboard", element: <DashboardPage /> }],
      },
    ],
  },
  { path: "*", element: <Navigate to="/" replace /> },
]);