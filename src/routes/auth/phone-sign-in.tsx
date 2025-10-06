import { createFileRoute } from "@tanstack/react-router";
import { PhoneSignInForm } from "@/components/auth/phone-sign-in-form";

export const Route = createFileRoute("/auth/phone-sign-in")({
  component: PhoneSignInPage,
  validateSearch: (search: Record<string, unknown>) => {
    return {
      callbackUrl: (search.callbackUrl as string) || "/",
    };
  },
});

function PhoneSignInPage() {
  const { callbackUrl } = Route.useSearch();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <PhoneSignInForm callbackUrl={callbackUrl} />
    </div>
  );
}
