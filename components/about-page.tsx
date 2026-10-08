"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import { getAboutPageContent } from "@/lib/content";
import SiteFooter from "@/components/site-footer";

export default function AboutPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const { about, mission, research, whatWeDo } = getAboutPageContent(locale);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

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

          <div className="w-[5.5rem]" aria-hidden />
        </div>
      </nav>

      <main>
        {/* Intro */}
        <section className="container mx-auto max-w-6xl px-4 py-14 md:py-20">
          <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
            <div className="space-y-5">
              <Badge className="border-0 bg-cyan-100 text-cyan-800">{about.eyebrow}</Badge>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                {about.title}
              </h1>
              <div className="space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
                <p>{about.paragraph1}</p>
                <p>{about.paragraph2}</p>
              </div>
            </div>
            <div className="flex justify-center md:justify-end">
              <img
                src="/assests/logo.png"
                alt="LADINT"
                className="h-auto w-full max-w-md object-contain drop-shadow-xl md:max-w-lg"
              />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
          <Badge className="mb-3 border-0 bg-cyan-100 text-cyan-800">{mission.eyebrow}</Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {mission.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
            <p>{mission.paragraph1}</p>
            <p>{mission.paragraph2}</p>
          </div>
        </section>

        {/* What moves us + objectives */}
        <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="space-y-5">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
                {about.subheading}
              </h2>
              <p className="text-base leading-relaxed text-slate-600 md:text-lg">{about.paragraph3}</p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-md md:p-8">
              <h3 className="text-lg font-bold text-slate-900">{about.objectivesTitle}</h3>
              <ul className="mt-4 list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-slate-600 md:text-base">
                {about.objectives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 rounded-2xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 p-6 text-white shadow-lg md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-300">
              {about.researchLine.eyebrow}
            </p>
            <h3 className="mt-3 text-xl font-bold md:text-2xl">{about.researchLine.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
              {about.researchLine.text}
            </p>
          </div>
        </section>

        {/* What we do */}
        <section className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          <Badge className="mb-3 border-0 bg-cyan-100 text-cyan-800">{whatWeDo.eyebrow}</Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {whatWeDo.title}
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 md:text-lg">
            {whatWeDo.intro}
          </p>
          <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whatWeDo.cards.map((card) => (
              <li
                key={card.title}
                className="rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-md"
              >
                <h3 className="text-lg font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{card.body}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Research */}
        <section className="container mx-auto max-w-4xl px-4 py-12 md:py-16">
          <Badge className="mb-3 border-0 bg-cyan-100 text-cyan-800">{research.eyebrow}</Badge>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
            {research.title}
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
            <p>{research.paragraph1}</p>
            <p>{research.paragraph2}</p>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto max-w-5xl px-4 pb-20 pt-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 px-8 py-12 text-white shadow-2xl md:px-12">
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
              <p className="max-w-xl text-lg font-semibold leading-snug md:text-xl">
                {about.paragraph2}
              </p>
              <Button
                asChild
                className="rounded-full bg-cyan-500 px-8 py-3 font-bold text-slate-950 shadow-lg hover:bg-cyan-400"
              >
                <Link href={t.joinPath}>{t.becomeMemberCta}</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
    </div>
  );
}
