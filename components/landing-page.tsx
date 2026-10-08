"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  ChevronRight,
  Loader2,
  Award,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { getDictionary, type Locale, type DepartmentKey } from "@/lib/i18n";
import SiteFooter from "@/components/site-footer";

export default function LandingPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Dynamic Data from Neon Postgres
  const [events, setEvents] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    clubName: t.defaultClubName,
    clubAcronym: "LADINT",
    tagline: t.defaultTagline,
    contactEmail: "ladint.contato@academico.br",
    instagram: "@ladint.oficial",
    linkedin: "linkedin.com/company/ladint",
    acceptingMembers: false,
  });

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  const heroRef = useRef<HTMLElement | null>(null);

  // Newsletter Subscription Form state
  const [subEmail, setSubEmail] = useState("");
  const [subName, setSubName] = useState("");
  const [subLoading, setSubLoading] = useState(false);
  const [activeDept, setActiveDept] = useState<DepartmentKey>("advisory");

  // Section Refs for smooth scrolling
  const missionRef = useRef<HTMLDivElement | null>(null);
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const newsletterRef = useRef<HTMLDivElement | null>(null);
  const councilRef = useRef<HTMLDivElement | null>(null);

  // Fetch data from Neon DB
  useEffect(() => {
    async function loadData() {
      try {
        const [evsRes, settingsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/settings?key=general"),
        ]);

        const [evsData, settingsData] = await Promise.all([
          evsRes.json(),
          settingsRes.json(),
        ]);

        if (evsData.success && evsData.data) setEvents(evsData.data);
        if (settingsData.success && settingsData.data) {
          const data = settingsData.data;
          setSiteSettings({
            ...data,
            clubName: locale === "en" ? t.defaultClubName : data.clubName || t.defaultClubName,
            tagline: locale === "en" ? t.defaultTagline : data.tagline || t.defaultTagline,
          });
        }
      } catch (err) {
        console.error("Error loading landing page data:", err);
      }
    }
    loadData();
  }, [locale, t.defaultClubName, t.defaultTagline]);

  // Handle Newsletter Subscription
  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subEmail || !subEmail.includes("@")) {
      toast.error(t.invalidEmail);
      return;
    }

    setSubLoading(true);
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subEmail, name: subName }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(data.message);
      setSubEmail("");
      setSubName("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubLoading(false);
    }
  };

  const councilMembers = t.councilMembers;
  const acceptingMembers = !!siteSettings.acceptingMembers;
  const visibleMembers = councilMembers.filter((m) => m.departmentKey === activeDept);

  const scrollPastHero = () => {
    missionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7fbfe] to-[#edf6fc] text-slate-800">
      {/* Soft mist behind fixed header */}
      <div aria-hidden className="header-blur-veil pointer-events-none fixed inset-x-0 top-0 z-40" />

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 z-50">
        <div className="container mx-auto flex items-center justify-center px-4 py-3">
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-slate-600 sm:gap-x-6">
            <Link href={t.aboutPath} className="hidden hover:text-cyan-600 transition lg:inline">
              {t.navAbout}
            </Link>
            <Link href={t.articlesPath} className="hidden hover:text-cyan-600 transition lg:inline">
              {t.navArticles}
            </Link>

            {acceptingMembers && (
              <Button
                asChild
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md text-xs sm:text-sm font-semibold rounded-full px-4 sm:px-5 py-2 transition transform hover:scale-105"
              >
                <Link href={t.joinPath}>{t.becomeMember}</Link>
              </Button>
            )}

            {events.length > 0 && (
              <button
                onClick={() => eventsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="hidden hover:text-cyan-600 transition lg:inline"
              >
                {t.navEvents}
              </button>
            )}
            <button
              onClick={() => councilRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hidden hover:text-cyan-600 transition lg:inline"
            >
              {t.navCouncil}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero — brand first */}
      <section
        ref={heroRef}
        className="relative isolate flex min-h-[100dvh] w-full items-center overflow-hidden"
      >
        {/* Full-bleed atmosphere */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_80%_at_50%_-10%,#dff6ff_0%,#f4faff_42%,#e8f4fc_100%)]" />
        <div className="hero-grid absolute inset-0 -z-10 opacity-[0.35]" />
        <div className="hero-orb hero-orb-a absolute -z-10" />
        <div className="hero-orb hero-orb-b absolute -z-10" />
        <div className="hero-orb hero-orb-c absolute -z-10" />
        <div className="hero-orb hero-orb-d absolute -z-10" />

        {/* Gradient blur — text arriving (top) and leaving (bottom) */}
        <div className="hero-mist hero-mist-top pointer-events-none absolute inset-x-0 top-0 z-[1] h-[28%]" />
        <div className="hero-mist hero-mist-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[32%]" />

        <div className="relative z-[2] mx-auto flex w-full max-w-4xl flex-col items-center px-4 py-10 text-center sm:px-8">
          <div className="hero-text-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[70%] w-[80%] -translate-x-1/2 -translate-y-1/2" />

          <h1 className="hero-enter-brand text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="bg-gradient-to-br from-cyan-600 via-sky-600 to-blue-800 bg-clip-text text-transparent">
              {t.brandMark}
            </span>
          </h1>

          <p className="hero-enter-copy mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
            {siteSettings.tagline || t.defaultTagline}
          </p>

          <div className="hero-enter-cta mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={scrollPastHero}
              variant="outline"
              className="px-8 py-6 border-slate-300 bg-white/70 hover:bg-white text-slate-700 text-base sm:text-lg font-semibold rounded-full"
            >
              {t.exploreSite} <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* About — high overview of the club */}
      <section
        id="sobre"
        ref={missionRef}
        className="container mx-auto max-w-6xl scroll-mt-24 px-4 py-20"
      >
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="space-y-5 text-left">
            <p className="text-slate-600 text-base sm:text-lg md:text-xl leading-relaxed">
              {t.foundationsBadge}
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {t.ourMission}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
              <p>{t.missionP1}</p>
              <p>{t.missionP2}</p>
            </div>
            <div className="pt-2">
              <Button
                asChild
                className="rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md transition hover:from-cyan-600 hover:to-blue-700"
              >
                <Link href={t.aboutPath}>{t.aboutMoreCta}</Link>
              </Button>
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

      {events.length > 0 && (
        <section ref={eventsRef} className="container mx-auto px-4 py-16 max-w-6xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.eventsTitle}</h2>
              <p className="text-slate-600 text-sm mt-1 max-w-xl">
                {t.eventsSubtitle}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((ev) => (
              <Card
                key={ev.id}
                className="overflow-hidden bg-white/95 border-slate-200/80 shadow-md hover:shadow-2xl transition-all duration-300 rounded-2xl flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <img
                      src={ev.image_url || "/placeholder.jpg"}
                      alt={ev.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold rounded-full">
                        {new Date(ev.event_date).toLocaleDateString(t.dateLocale)}
                      </span>
                    </div>
                  </div>

                  <CardHeader className="pb-2">
                    <span className="text-xs font-semibold text-cyan-600">{ev.location}</span>
                    <CardTitle className="text-lg font-bold text-slate-900 leading-snug">{ev.title}</CardTitle>
                    {ev.achievements && (
                      <div className="mt-2 inline-flex items-center space-x-1.5 px-3 py-1 bg-amber-50 border border-amber-200/80 text-amber-900 rounded-lg text-xs font-semibold">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span className="truncate">{ev.achievements}</span>
                      </div>
                    )}
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">{ev.description}</p>
                  </CardContent>
                </div>

                <div className="p-5 pt-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedEvent(ev)}
                    className="w-full text-xs border-slate-200 hover:border-cyan-300 hover:text-cyan-700"
                  >
                    {t.eventDetails}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Council — full-screen section */}
      <section
        ref={councilRef}
        className="relative flex min-h-[100dvh] w-full scroll-mt-0 items-center overflow-hidden"
      >
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_50%_0%,#e8f6ff_0%,#f7fbfe_45%,#edf6fc_100%)]" />
        <div className="hero-grid absolute inset-0 -z-10 opacity-[0.2]" />

        <div className="container mx-auto w-full max-w-6xl px-4 py-24 md:py-28">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900">
              {t.councilTitle}
            </h2>
            <p className="text-slate-600 text-base sm:text-lg md:text-xl mt-3 max-w-2xl mx-auto leading-relaxed">
              {t.councilSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {t.councilDepartments.map((dept) => (
              <button
                key={dept.key}
                type="button"
                onClick={() => setActiveDept(dept.key)}
                className={`px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-full transition-all duration-200 ${
                  activeDept === dept.key
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                    : "bg-white/80 text-slate-600 border border-slate-200 hover:border-cyan-300 hover:text-cyan-700"
                }`}
              >
                {dept.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {visibleMembers.map((member) => (
              <Card
                key={member.name}
                className="w-full sm:w-[calc(50%-0.75rem)] md:w-[calc(33.333%-1rem)] lg:w-[calc(25%-1.125rem)] max-w-xs text-center bg-white/90 backdrop-blur shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 border-slate-200/80 p-5 flex flex-col justify-between"
              >
                <div>
                  <Avatar className="mx-auto w-24 h-24 ring-4 ring-cyan-100 shadow-md">
                    <AvatarImage src={member.image} alt={member.name} className="object-cover" />
                    <AvatarFallback className="bg-cyan-600 text-white font-bold text-lg">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-4 text-base font-bold text-slate-900">{member.name}</CardTitle>
                  <CardDescription className="text-xs text-cyan-700 font-semibold">{member.role}</CardDescription>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter subscription */}
      <section ref={newsletterRef} className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 text-white p-10 md:p-16 shadow-2xl min-h-[28rem] md:min-h-[32rem] flex items-center">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid w-full lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1]">
                {t.newsletterTitle}
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {t.newsletterBody}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3 pt-1">
                <div className="grid sm:grid-cols-2 gap-3">
                  <Input
                    placeholder={t.namePlaceholder}
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 text-sm"
                  />
                  <Input
                    type="email"
                    required
                    placeholder={t.emailPlaceholder}
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 focus:bg-white/20 text-sm"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={subLoading}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition duration-200"
                >
                  {subLoading ? (
                    <span className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> {t.subscribing}
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <Send className="w-4 h-4 mr-2" /> {t.subscribeFree}
                    </span>
                  )}
                </Button>
                <p className="text-[11px] text-slate-400 text-center">
                  {t.privacyNote}
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter
        locale={locale}
        contactEmail={siteSettings.contactEmail || "ladint.contato@academico.br"}
        instagram={siteSettings.instagram || "@ladint.oficial"}
      />

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            {selectedEvent.image_url && (
              <div className="h-56 w-full -mt-6 -mx-6 mb-4 overflow-hidden rounded-t-lg bg-slate-100">
                <img src={selectedEvent.image_url} alt={selectedEvent.title} className="w-full h-full object-cover" />
              </div>
            )}
            <DialogHeader>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-cyan-700">{selectedEvent.location}</span>
                <span>{new Date(selectedEvent.event_date).toLocaleDateString(t.dateLocale)}</span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900 leading-snug">
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription className="text-xs font-medium text-slate-600">
                {selectedEvent.event_name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2">
              {selectedEvent.achievements && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center space-x-2 text-amber-900 text-xs font-semibold">
                  <Trophy className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>{t.awardLabel} {selectedEvent.achievements}</span>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.aboutActuation}</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedEvent.description}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
