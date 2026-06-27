"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { AuthScreen } from "@/components/auth-screen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

const registerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters")
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setMessage(null);

    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          name: values.name
        }
      }
    });

    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Account created. Please verify your email before signing in.");
    router.push("/verify");
  });

  return (
    <AuthScreen
      title="Create your SMSPrime account"
      description="Set up your workspace, connect a provider later, and unlock the premium dashboard experience."
      footer={
        <p className="text-sm text-muted">
          Already have an account? <Link href="/login" className="text-primary">Sign in</Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm text-muted">Full name</label>
          <Input placeholder="Ahmed Y." {...form.register("name")} />
          {form.formState.errors.name ? <p className="mt-2 text-xs text-danger">{form.formState.errors.name.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted">Email</label>
          <Input type="email" placeholder="you@example.com" {...form.register("email")} />
          {form.formState.errors.email ? <p className="mt-2 text-xs text-danger">{form.formState.errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted">Password</label>
          <Input type="password" placeholder="Create a secure password" {...form.register("password")} />
          {form.formState.errors.password ? <p className="mt-2 text-xs text-danger">{form.formState.errors.password.message}</p> : null}
        </div>
        {message ? <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text">{message}</div> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthScreen>
  );
}
