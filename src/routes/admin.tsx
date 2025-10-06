import { createFileRoute } from "@tanstack/react-router";
import { AuthGuard } from "@/components/auth/auth-guard";
import { AdminGuard } from "@/components/auth/admin-guard";
import { useUser } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const user = useUser();

  return (
    <AuthGuard>
      <AdminGuard>
        <div className="container mx-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold">Admin Panel</h1>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Admin Information</h2>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {user?.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Role:</span> Administrator
                </p>
              </div>
            </div>

            <div className="rounded-lg border bg-card p-6 shadow-sm">
              <h3 className="text-lg font-semibold mb-2">Admin-Only Content</h3>
              <p className="text-sm text-muted-foreground">
                This page is only accessible to administrators. Regular users
                will be redirected if they try to access this page.
              </p>
            </div>
          </div>
        </div>
      </AdminGuard>
    </AuthGuard>
  );
}
