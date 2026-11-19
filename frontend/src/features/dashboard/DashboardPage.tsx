import { useQuery } from "@tanstack/react-query";

import { fetchMe } from "../../api/auth";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../auth/useAuth";

export function DashboardPage() {
  const { user } = useAuth();

  // This is the pattern we'll use for repos, PRs and reviews in later phases.
  const profile = useQuery({ queryKey: ["me"], queryFn: fetchMe });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome{user?.display_name ? `, ${user.display_name}` : ""}
        </h1>
        <p className="mt-1 text-slate-600">Your review activity will appear here.</p>
      </div>

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
        <h2 className="text-lg font-medium">No repositories connected yet</h2>
        <p className="mt-1 text-sm text-slate-500">GitHub integration arrives in Phase 2.</p>
      </section>

      <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h2 className="text-lg font-medium">Account</h2>
        {profile.isPending && <p className="mt-2 text-sm text-slate-500">Loading…</p>}
        {profile.isError && <p className="mt-2 text-sm text-red-600">Could not load your profile.</p>}
        {profile.data && (
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-slate-500">Email:</dt>
              <dd>{profile.data.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-slate-500">Member since:</dt>
              <dd>{new Date(profile.data.date_joined).toLocaleDateString()}</dd>
            </div>
          </dl>
        )}
        <Button
          variant="secondary"
          className="mt-4"
          loading={profile.isFetching}
          onClick={() => void profile.refetch()}
        >
          Reload
        </Button>
      </section>
    </div>
  );
}