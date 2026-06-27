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

const verifySchema = z.object({
  email: z.string().email("Enter a valid email"),
  token: z.string().min(6, "Enter the verification code")
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyPage() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: { email: "", token: "" }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.verifyOtp({
        email: values.email,
        token: values.token,
        type: "email"
      });

      if (error) {
        setMessage(error.message);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to verify your account right now.");
    } finally {
      setLoading(false);
    }
  });

  return (
    <AuthScreen
      title="Verify your account"
      description="Enter the one-time code sent to your email to complete secure access."
      footer={
        <p className="text-sm text-muted">
          Didn&apos;t receive it? <Link href="/login" className="text-primary">Back to sign in</Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label className="mb-2 block text-sm text-muted">Email</label>
          <Input type="email" placeholder="you@example.com" {...form.register("email")} />
          {form.formState.errors.email ? <p className="mt-2 text-xs text-danger">{form.formState.errors.email.message}</p> : null}
        </div>
        <div>
          <label className="mb-2 block text-sm text-muted">Verification code</label>
          <Input inputMode="numeric" placeholder="123456" {...form.register("token")} />
          {form.formState.errors.token ? <p className="mt-2 text-xs text-danger">{form.formState.errors.token.message}</p> : null}
        </div>
        {message ? <div className="rounded-xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">{message}</div> : null}
        <Button className="w-full" disabled={loading}>
          {loading ? "Verifying..." : "Verify now"}
        </Button>
      </form>
    </AuthScreen>
  );
}
