import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/auth-guard";
import { useUser, useSignOut } from "@/hooks/use-auth";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const user = useUser();
  const signOut = useSignOut();

  return (
    <AuthGuard>
      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button
              type="button"
              onClick={() => signOut()}
              className="rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Sign Out
            </button>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Welcome back!</h2>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Name:</span> {user?.name}
              </p>
              <p className="text-sm">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm">
                <span className="font-medium">User ID:</span> {user?.id}
              </p>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-2">Protected Content</h3>
            <p className="text-sm text-muted-foreground">
              This page is only accessible to authenticated users. If you're
              seeing this, it means you're successfully logged in!
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
