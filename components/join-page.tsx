"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import SiteFooter from "@/components/site-footer";

export default function JoinPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [pageLoading, setPageLoading] = useState(true);
  const [acceptingMembers, setAcceptingMembers] = useState(false);
  const [joinFormUrl, setJoinFormUrl] = useState("");

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
          setJoinFormUrl((data.data.joinFormUrl || "").trim());
        }
      } catch (err) {
        console.error("Error loading join page settings:", err);
      } finally {
        setPageLoading(false);
      }
    }
    loadSettings();
  }, []);

  const canJoin = acceptingMembers && !!joinFormUrl;

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

          <Link
            href={t.homePath}
            className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-lg font-extrabold tracking-tight text-transparent"
          >
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
        <div className="relative flex min-h-[28rem] w-full items-center overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 p-10 text-white shadow-2xl md:min-h-[32rem] md:p-16">
          <div className="pointer-events-none absolute -right-10 -top-10 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

          {pageLoading ? (
            <div className="relative z-10 flex w-full flex-col items-center justify-center gap-4 py-16">
              <Loader2 className="h-10 w-10 animate-spin text-cyan-300" />
              <p className="text-sm font-medium text-slate-300 md:text-base">{t.loadingPage}</p>
            </div>
          ) : (
            <div className="relative z-10 grid w-full items-center gap-10 lg:grid-cols-2 lg:gap-16">
              <div>
                <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl md:text-6xl">
                  {acceptingMembers ? t.ctaTitle : t.ctaClosedTitle}
                </h1>
              </div>

              <div className="space-y-6">
                <p className="text-sm leading-relaxed text-slate-300 md:text-base">
                  {canJoin
                    ? t.ctaBody
                    : acceptingMembers
                      ? t.joinFormMissingBody
                      : t.ctaClosedBody}
                </p>

                {canJoin ? (
                  <Button
                    asChild
                    className="w-full rounded-xl bg-cyan-500 py-3 font-bold text-slate-950 shadow-lg transition duration-200 hover:bg-cyan-400"
                  >
                    <a href={joinFormUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      {t.openJoinForm}
                    </a>
                  </Button>
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
