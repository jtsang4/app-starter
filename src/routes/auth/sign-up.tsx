import { createFileRoute } from "@tanstack/react-router";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const Route = createFileRoute("/auth/sign-up")({
  component: SignUpPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      callbackUrl: (search.callbackUrl as string) || "/",
    };
  },
});

function SignUpPage() {
  const { callbackUrl } = Route.useSearch();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUpForm callbackUrl={callbackUrl} />
    </div>
  );
}
