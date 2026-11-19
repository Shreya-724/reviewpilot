import { Navigate, Outlet, useLocation } from "react-router-dom";

import { FullPageSpinner } from "../../components/ui/Spinner";
import { useAuth } from "./useAuth";

type FromState = { from?: { pathname: string } } | null;

/** Only logged-in users get through; others are sent to /login. */
export function ProtectedRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

/** Login/register pages: logged-in users are bounced to where they were headed. */
export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullPageSpinner />;
  if (user) {
    const from = (location.state as FromState)?.from?.pathname;
    return <Navigate to={from ?? "/dashboard"} replace />;
  }
  return <Outlet />;
}