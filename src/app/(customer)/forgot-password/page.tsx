"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Loader2, CheckCircle } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PageHeader } from "@/components/shared/PageHeader";
import { PublicRoute } from "@/components/customer/RouteGuards";
import { toast } from "sonner";
import { getAuthUrl } from "@/lib/auth/config";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError("");
    setIsSubmitting(true);

    try {
      const redirectTo = `${window.location.origin}/reset-password`;

      const response = await fetch(getAuthUrl('/api/auth/request-password-reset'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: data.email,
          redirectTo,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === true) {
        setSuccess(true);
        toast.success(result.message || "If the email exists, a reset link has been sent");
      } else {
        setError(result.message || "Failed to send reset email");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicRoute>
      <div className="mx-auto w-full max-w-md py-16 px-4">
        <PageHeader
          title="Forgot password?"
          description="Enter your email and we'll send you a link to reset your password."
        />

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success ? (
          <div className="mt-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h3 className="font-display text-xl text-ink">Check your email</h3>
            <p className="mt-2 text-muted">
              If an account exists for that email, you'll receive a password reset link shortly.
            </p>
            <Link href="/login" className="mt-6 inline-block text-sky hover:underline">
              Back to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-ink">
                Email
              </Label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  {...register("email")}
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-clay">{errors.email.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-muted">
          Remember your password?{" "}
          <Link href="/login" className="text-sky hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </PublicRoute>
  );
}