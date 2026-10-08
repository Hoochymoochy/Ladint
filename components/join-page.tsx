"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { getDictionary, type Locale } from "@/lib/i18n";
import SiteFooter from "@/components/site-footer";

/** Formats digits into Brazilian mobile: +55 XX 9NNNN-NNNN */
function formatBrazilianPhone(value: string) {
  let digits = value.replace(/\D/g, "");

  if (digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  digits = digits.slice(0, 11);

  if (digits.length === 0) return "";

  let formatted = `+55 ${digits.slice(0, 2)}`;
  if (digits.length <= 2) return formatted.trimEnd();

  const local = digits.slice(2);
  if (local.length <= 5) {
    return `${formatted} ${local}`;
  }

  return `${formatted} ${local.slice(0, 5)}-${local.slice(5)}`;
}

export default function JoinPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [pageLoading, setPageLoading] = useState(true);
  const [acceptingMembers, setAcceptingMembers] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [appLoading, setAppLoading] = useState(false);
  const [appForm, setAppForm] = useState({
    name: "",
    email: "",
    phone: "",
    course_semester: "",
    motivation: "",
  });

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  useEffect(() => {
    async function loadSettings() {
      setPageLoading(true);
      try {
        const res = await fetch("/api/settings?key=general");
        const data = await res.json();
        if (data.success && data.data) {
          setAcceptingMembers(!!data.data.acceptingMembers);
        }
      } catch (err) {
        console.error("Error loading join page settings:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleMotivationChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const el = e.target;
    setAppForm({ ...appForm, motivation: el.value });
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAppLoading(true);
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(appForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      setAppForm({
        name: "",
        email: "",
        phone: "",
        course_semester: "",
        motivation: "",
      });
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAppLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7fbfe] to-[#edf6fc] text-slate-800">
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link
            href={t.homePath}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-700"
          >
            <ArrowLeft className="h-4 w-4" />
            {t.backHome}
          </Link>

          <Link href={t.homePath} className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
            LADINT
          </Link>

          <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
            <Link
              href="/ingressar"
              className={`rounded-full px-2.5 py-1 transition ${
                locale === "pt" ? "bg-white text-cyan-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.langPt}
            </Link>
            <Link
              href="/en/join"
              className={`rounded-full px-2.5 py-1 transition ${
                locale === "en" ? "bg-white text-cyan-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.langEn}
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto flex min-h-[calc(100dvh-4rem)] max-w-5xl items-center px-4 py-12 md:py-16">
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 text-white p-10 md:p-16 shadow-2xl min-h-[28rem] md:min-h-[32rem] flex items-center">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

          {pageLoading ? (
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-300" />
              <p className="text-sm font-medium text-slate-300 md:text-base">{t.loadingPage}</p>
            </div>
          ) : submitted ? (
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-6 py-10 text-center">
              <CheckCircle2 className="h-14 w-14 text-cyan-300" />
              <div className="space-y-3 max-w-xl">
                <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
                  {t.applySuccessTitle}
                </h1>
                <p className="text-sm leading-relaxed text-slate-300 md:text-base">
                  {t.applySuccessBody}
                </p>
              </div>
              <Button
                asChild
                className="rounded-xl bg-cyan-500 px-8 py-3 font-bold text-slate-950 shadow-lg transition duration-200 hover:bg-cyan-400"
              >
                <Link href={t.homePath}>{t.backHome}</Link>
              </Button>
            </div>
          ) : (
            <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h1 className="text-4xl font-extrabold tracking-tight leading-[1.1] sm:text-5xl md:text-6xl">
                  {acceptingMembers ? t.ctaTitle : t.ctaClosedTitle}
                </h1>
              </div>

              <div className="space-y-6">
                <p className="text-sm leading-relaxed text-slate-300 md:text-base">
                  {acceptingMembers ? t.ctaBody : t.ctaClosedBody}
                </p>

                {acceptingMembers ? (
                  <form onSubmit={handleApplicationSubmit} className="space-y-3 pt-1">
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        required
                        placeholder={t.fullNamePlaceholder}
                        value={appForm.name}
                        onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
                        className="border-white/20 bg-white/10 text-sm text-white placeholder:text-slate-400 focus:bg-white/20"
                      />
                      <Input
                        type="email"
                        required
                        placeholder={t.emailPlaceholder}
                        value={appForm.email}
                        onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
                        className="border-white/20 bg-white/10 text-sm text-white placeholder:text-slate-400 focus:bg-white/20"
                      />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Input
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder={t.phonePlaceholder}
                        value={appForm.phone}
                        onChange={(e) =>
                          setAppForm({ ...appForm, phone: formatBrazilianPhone(e.target.value) })
                        }
                        className="border-white/20 bg-white/10 text-sm text-white placeholder:text-slate-400 focus:bg-white/20"
                      />
                      <Input
                        placeholder={t.coursePlaceholder}
                        value={appForm.course_semester}
                        onChange={(e) => setAppForm({ ...appForm, course_semester: e.target.value })}
                        className="border-white/20 bg-white/10 text-sm text-white placeholder:text-slate-400 focus:bg-white/20"
                      />
                    </div>
                    <Textarea
                      rows={3}
                      placeholder={t.motivationPlaceholder}
                      value={appForm.motivation}
                      onChange={handleMotivationChange}
                      className="min-h-[5.5rem] resize-none overflow-hidden border-white/20 bg-white/10 text-sm text-white caret-white placeholder:text-slate-400 focus:bg-white/20 focus-visible:text-white"
                    />
                    <Button
                      type="submit"
                      disabled={appLoading}
                      className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 shadow-lg transition duration-200 hover:bg-cyan-400"
                    >
                      {appLoading ? (
                        <span className="flex items-center justify-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.submitApplication}
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <CheckCircle2 className="mr-2 h-4 w-4" /> {t.becomeMemberCta}
                        </span>
                      )}
                    </Button>
                  </form>
                ) : (
                  <Button
                    asChild
                    className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 shadow-lg transition duration-200 hover:bg-cyan-400"
                  >
                    <Link href={t.homePath}>{t.backHome}</Link>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
