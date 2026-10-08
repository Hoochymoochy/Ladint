"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { getAdminDictionary } from "@/lib/admin-i18n";
import type { Locale } from "@/lib/i18n";

export default function AdminLoginPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getAdminDictionary(locale);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      toast.error(t.loginPasswordRequired);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || t.loginFailed);

      toast.success(t.loginSuccess);
      const next = searchParams.get("next");
      const fallback = locale === "en" ? "/en/admin" : "/admin";
      router.replace(next && next.startsWith("/") ? next : fallback);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || t.loginFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,#dff6ff_0%,#f4faff_42%,#e8f4fc_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(rgba(14,165,233,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white/90 p-8 shadow-xl backdrop-blur sm:p-10">
        <div className="mb-8 text-center">
          <Link
            href={t.homePath}
            className="inline-block bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent"
          >
            LADINT
          </Link>
          <h1 className="mt-4 text-xl font-bold text-slate-900">{t.loginTitle}</h1>
          <p className="mt-2 text-sm text-slate-500">{t.loginSubtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              {t.loginPasswordLabel}
            </label>
            <Input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.loginPasswordPlaceholder}
              className="h-11 border-slate-200 bg-white text-black caret-black placeholder:text-slate-400"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-white hover:from-cyan-600 hover:to-blue-700"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.loginSubmitting}
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Lock className="mr-2 h-4 w-4" />
                {t.loginSubmit}
              </span>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate-400">
          <Link href={t.homePath} className="font-semibold text-cyan-600 hover:underline">
            {t.backToSite}
          </Link>
        </p>
      </div>
    </div>
  );
}
