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
        errorCallbackURL: new URL('/login', window.location.origin).toString(),
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
          type="button"
          variant="outline"
          className="gap-2"
          onClick={handleGoogleLogin}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill="currentColor" d="M21.35 11.1h-9.17v2.99h5.26c-.23 1.48-1.43 4.33-5.26 4.33-3.17 0-5.75-2.62-5.75-5.84s2.58-5.84 5.75-5.84c1.8 0 3.01.77 3.71 1.44l2.53-2.44C17.2 2.1 15.25 1 12.17 1 6.89 1 2.67 5.33 2.67 10.29s4.22 9.29 9.5 9.29c5.47 0 8.99-3.83 8.99-9.16 0-.62-.07-1.12-.81-2.02z"/>
          </svg>
          Google
        </Button>
        <Button variant="outline" className="gap-2" disabled>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12.07C22 6.48 17.52 2 11.93 2S2 6.48 2 12.07C2 17.09 5.66 21.19 10.44 22v-7.01H8.08v-2.92h2.36V10.6c0-2.33 1.39-3.62 3.52-3.62 1.02 0 2.09.18 2.09.18v2.29h-1.18c-1.16 0-1.52.72-1.52 1.46v1.76h2.59l-.41 2.92h-2.18V22C18.34 21.19 22 17.09 22 12.07z"/>
          </svg>
          Facebook
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
