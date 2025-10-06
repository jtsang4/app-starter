import { createFileRoute } from "@tanstack/react-router";
import { SignInForm } from "@/components/auth/sign-in-form";

export const Route = createFileRoute("/auth/sign-in")({
  component: SignInPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      callbackUrl: (search.callbackUrl as string) || "/",
    };
  },
});

function SignInPage() {
  const { callbackUrl } = Route.useSearch();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
