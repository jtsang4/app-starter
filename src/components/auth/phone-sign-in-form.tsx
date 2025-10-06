import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  useSendPhoneOTP,
  useVerifyPhoneOTP,
  useAuthError,
} from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PhoneSignInFormProps {
  callbackUrl?: string;
}

export function PhoneSignInForm({ callbackUrl = "/" }: PhoneSignInFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const sendPhoneOTP = useSendPhoneOTP();
  const verifyPhoneOTP = useVerifyPhoneOTP();
  const authError = useAuthError();
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await sendPhoneOTP(phoneNumber);

      if (result.success) {
        setIsOtpSent(true);
        setCountdown(60);

        // Start countdown timer
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        setError(result.error || "Failed to send OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await verifyPhoneOTP(phoneNumber, otp);

      if (result.success) {
        navigate({ to: callbackUrl });
      } else {
        setError(result.error || "Invalid OTP");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;
    await handleSendOTP(new Event("submit") as any);
  };

  const displayError = error || authError;

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Sign In with Phone</h1>
        <p className="text-muted-foreground">
          {isOtpSent
            ? "Enter the verification code sent to your phone"
            : "Enter your phone number to receive a verification code"}
        </p>
      </div>

      {!isOtpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          {displayError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {displayError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+1234567890"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">
              Include country code (e.g., +1 for US)
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          {displayError && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {displayError}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="tel"
              value={phoneNumber}
              disabled
              className="bg-muted"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="otp">Verification Code</Label>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              disabled={isLoading}
              maxLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify & Sign In"}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={countdown > 0 || isLoading}
              className="font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {countdown > 0
                ? `Resend code in ${countdown}s`
                : "Resend verification code"}
            </button>
          </div>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => {
                setIsOtpSent(false);
                setOtp("");
                setError(null);
              }}
              className="font-medium text-muted-foreground hover:underline"
              disabled={isLoading}
            >
              Change phone number
            </button>
          </div>
        </form>
      )}

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <div className="text-center text-sm space-y-2">
        <button
          type="button"
          onClick={() => {
            navigate({
              to: "/auth/sign-in",
              search: { callbackUrl: callbackUrl || "/" },
            });
          }}
          className="font-medium text-primary hover:underline block w-full"
          disabled={isLoading}
        >
          Sign in with email
        </button>
        <div>
          <span className="text-muted-foreground">Don't have an account? </span>
          <button
            type="button"
            onClick={() => {
              navigate({
                to: "/auth/sign-up",
                search: { callbackUrl: callbackUrl || "/" },
              });
            }}
            className="font-medium text-primary hover:underline"
            disabled={isLoading}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
