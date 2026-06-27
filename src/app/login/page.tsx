"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword(values);

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  });

  return (
    <AuthScreen
      title="Welcome back to SMSPrime"
      description="Sign in to manage your wallet, orders, SMS messages, and provider tools in one secure place."
      footer={
        <div className="space-y-2 text-sm text-muted">
          <p>
            New here? <Link href="/register" className="text-primary">Create an account</Link>
          </p>
          <p>
            Need verification? <Link href="/verify" className="text-primary">Verify your email</Link>
          </p>
        </div>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm text-muted">Email</label>
          <Input type="email" placeholder="you@example.com" {...form.register("email")} />
          {form.formState.errors.email ? <p className="mt-2 text-xs text-danger">{form.formState.errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted">Password</label>
          <Input type="password" placeholder="Enter your password" {...form.register("password")} />
          {form.formState.errors.password ? <p className="mt-2 text-xs text-danger">{form.formState.errors.password.message}</p> : null}
        </div>
        {message ? <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{message}</div> : null}
        <div className="flex items-center justify-between text-sm text-muted">
          <span>Remember me</span>
          <Link href="/subscription" className="text-primary">View plans</Link>
        </div>
        <Button className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthScreen>
  );
}
