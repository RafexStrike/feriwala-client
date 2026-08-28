"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/lib/auth/AuthProvider";
import { PublicRoute } from "@/components/customer/RouteGuards";
import { toast } from "sonner";
import { getAuthUrl } from "@/lib/auth/config";

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [canResend, setCanResend] = useState(false);

  const token = searchParams.get("token");
  const redirectTo = searchParams.get("redirect") || "/";

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setStatus("loading");
    setMessage("Verifying your email...");

    try {
      const response = await fetch(
        `${getAuthUrl('/api/auth/verify-email')}?token=${verificationToken}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus("success");
        setMessage("Email verified successfully! Redirecting...");
        await refresh();
        setTimeout(() => router.push(redirectTo), 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Invalid or expired verification link.");
      }
    } catch {
      setStatus("error");
      setMessage("An error occurred. Please try again or request a new link.");
    }
  };

  const resendVerification = async () => {
    try {
      await fetch(getAuthUrl('/api/auth/resend-verification'), {
        method: "POST",
        credentials: "include",
      });
      toast.success("Verification email sent!");
      setCanResend(false);
      setTimeout(() => setCanResend(true), 60000);
    } catch {
      toast.error("Failed to resend email");
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCanResend(true);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <PublicRoute>
      <div className="mx-auto w-full max-w-md py-16 px-4">
        <PageHeader
          title="Verify your email"
          description="We've sent a verification link to your email address."
        />

        <div className="mt-8 text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 mx-auto animate-spin text-sky" />
              <p className="text-muted">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500" />
              <h3 className="font-display text-xl text-ink">Email Verified!</h3>
              <p className="text-muted">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-clay" />
              <h3 className="font-display text-xl text-ink">Verification Failed</h3>
              <p className="text-muted">{message}</p>
              <Alert variant="destructive">
                <AlertDescription>
                  This link may have expired or already been used.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {status === "idle" && !token && (
            <div className="space-y-4">
              <Mail className="h-12 w-12 mx-auto text-muted" />
              <h3 className="font-display text-xl text-ink">Check your inbox</h3>
              <p className="text-muted">
                We've sent a verification link to your email address. Click the link to verify your account.
              </p>
              <Alert>
                <AlertDescription>
                  Didn't receive the email? Check your spam folder or request a new link below.
                </AlertDescription>
              </Alert>
            </div>
          )}

          {(status === "idle" || status === "error") && (
            <>
              <Separator className="my-6">Or</Separator>
              <Button
                variant="outline"
                className="w-full"
                onClick={resendVerification}
                disabled={!canResend}
              >
                {canResend ? "Resend Verification Email" : "Wait 60s before resending"}
              </Button>
              <p className="mt-4 text-center text-sm text-muted">
                <Link href="/login" className="text-sky hover:underline">Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </PublicRoute>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}