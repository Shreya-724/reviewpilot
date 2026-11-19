import { Link } from "react-router-dom";

import { useAuth } from "../features/auth/useAuth";

const primaryLink =
  "rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500";
const secondaryLink =
  "rounded-md px-4 py-2 text-sm font-medium text-slate-700 ring-1 ring-slate-300 hover:bg-slate-50";

export function LandingPage() {
  const { user, isLoading } = useAuth();

  return (
    <div className="min-h-screen bg-white">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <span className="text-xl font-bold text-indigo-600">ReviewPilot</span>
        <nav className="flex items-center gap-3">
          {!isLoading &&
            (user ? (
              <Link to="/dashboard" className={primaryLink}>
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className={secondaryLink}>
                  Log in
                </Link>
                <Link to="/register" className={primaryLink}>
                  Get started
                </Link>
              </>
            ))}
        </nav>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          AI code reviews for your pull requests
        </h1>
        <p className="mt-6 text-lg text-slate-600">
          Connect GitHub, pick a pull request, and get structured, severity-ranked findings from
          Claude. Suggestions only: you stay in control of every change.
        </p>
      </main>
    </div>
  );
}