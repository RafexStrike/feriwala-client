"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { PageHeader } from "@/components/shared/PageHeader";
import { useAuth } from "@/lib/auth/AuthProvider";
import { authClient } from "@/lib/auth/config";
import { loginSchema, type LoginInput } from "@/lib/utils/validation";
import { PublicRoute } from "@/components/customer/RouteGuards";
import { toast } from "sonner";

function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { login, isLoading: authLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleLogin = async () => {
    try {
      const callbackURL = new URL(
        redirectTo && redirectTo.startsWith('/') ? redirectTo : '/',
        window.location.origin
      ).toString();
      console.info('[AUTH-CLIENT][DEBUG] start google sign-in', { callbackURL });
      await authClient.signIn.social({
        provider: 'google',
        callbackURL,
      });
      console.info('[AUTH-CLIENT][DEBUG] signIn.social returned (navigation likely happened)');
    } catch (err: any) {
      toast.error(err?.message || 'Unable to start Google sign-in');
    }
  };

  const onSubmit = async (data: LoginInput) => {
    setError("");
    try {
      await login(data.email, data.password);
      router.push(redirectTo);
      router.refresh();
      toast.success("Welcome back!");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <div className="mx-auto w-full max-w-md py-16 px-4">
      <PageHeader
        title="Welcome back"
        description="Sign in to your account to continue."
      />

      {error && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium text-ink">Email</Label>
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

        <div>
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="block text-sm font-medium text-ink">Password</Label>
            <Link href="/forgot-password" className="text-sm text-sky hover:underline">Forgot password?</Link>
          </div>
          <div className="relative mt-1">
            <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register("password")}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-ink"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-clay">{errors.password.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || authLoading}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <Separator className="my-8">Or continue with</Separator>

      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleGoogleLogin}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/></svg>
          Google
        </Button>
        <Button variant="outline" className="gap-2" disabled>
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .318.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/></svg>
          GitHub
        </Button>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-sky hover:underline font-medium">Sign up</Link>
      </p>
    </div>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading: authLoading } = useAuth();
  const redirectTo = searchParams.get("redirect") || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    try {
      await login(data.email, data.password);
      router.push(redirectTo);
      router.refresh();
      toast.success("Welcome back!");
    } catch (err: any) {
      setError(err.message || "Invalid email or password");
    }
  };

  return (
    <PublicRoute>
      <LoginForm redirectTo={redirectTo} />
    </PublicRoute>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
