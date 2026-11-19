import { Outlet } from "react-router-dom";

import { useAuth } from "../../features/auth/useAuth";
import { Button } from "../ui/Button";

export function AppLayout() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <span className="text-lg font-bold text-indigo-600">ReviewPilot</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-600">{user?.display_name || user?.email}</span>
            <Button variant="secondary" onClick={() => void signOut()}>
              Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}