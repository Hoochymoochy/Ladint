"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Trophy,
  Mail,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Award,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { getDictionary, type Locale, type DepartmentKey } from "@/lib/i18n";

export default function LandingPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Dynamic Data from Neon Postgres
  const [events, setEvents] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
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
  const [showNav, setShowNav] = useState(false);

  useEffect(() => {
    const updateNav = () => {
      setShowNav(window.scrollY > 8);
    };

    updateNav();
    window.addEventListener("scroll", updateNav, { passive: true });
    return () => window.removeEventListener("scroll", updateNav);
  }, []);

  // Newsletter Subscription Form state
  const [subEmail, setSubEmail] = useState("");
  const [subName, setSubName] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  // Membership Application Form state
  const [appForm, setAppForm] = useState({
    name: "",
    email: "",
    phone: "",
    course_semester: "",
    motivation: "",
  });
  const [appLoading, setAppLoading] = useState(false);
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
        const [evsRes, newsRes, settingsRes] = await Promise.all([
          fetch("/api/events"),
          fetch("/api/newsletter"),
          fetch("/api/settings?key=general"),
        ]);

        const [evsData, newsData, settingsData] = await Promise.all([
          evsRes.json(),
          newsRes.json(),
          settingsRes.json(),
        ]);

        if (evsData.success && evsData.data) setEvents(evsData.data);
        if (newsData.success && newsData.data) setNewsletters(newsData.data);
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

  // Handle Membership Application Submit
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

      toast.success(data.message);
      setIsOpenForm(false);
      setAppForm({
        name: "",
        email: "",
        phone: "",
        course_semester: "",
        motivation: "",
      });
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setAppLoading(false);
    }
  };

  const councilMembers = t.councilMembers;
  const acceptingMembers = !!siteSettings.acceptingMembers;
  const activeDepartment = t.councilDepartments.find((d) => d.key === activeDept) ?? t.councilDepartments[0];
  const visibleMembers = councilMembers.filter((m) => m.departmentKey === activeDept);

  const scrollPastHero = () => {
    missionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToNewsletter = () => {
    newsletterRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7fbfe] to-[#edf6fc] text-slate-800">
      {/* Soft mist dissolve as content nears the header (same feel as hero text fade) */}
      <div
        aria-hidden
        className={`header-blur-veil pointer-events-none fixed inset-x-0 top-0 z-40 transition-opacity duration-500 ${
          showNav ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Top Navigation Bar */}
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          showNav
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => heroRef.current?.scrollIntoView({ behavior: "smooth" })}
          >
            <img src="/logo.png" alt="LADINT Logo" className="w-10 h-10 object-contain drop-shadow" />
            <div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                LADINT
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => missionRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-600 transition"
            >
              {t.navMission}
            </button>
            <Link href={t.articlesPath} className="hover:text-cyan-600 transition">
              {t.navArticles}
            </Link>
            {events.length > 0 && (
              <button
                onClick={() => eventsRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="hover:text-cyan-600 transition"
              >
                {t.navEvents}
              </button>
            )}
            <button
              onClick={() => newsletterRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-600 transition"
            >
              {t.navNewsletter}
            </button>
            <button
              onClick={() => councilRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-600 transition"
            >
              {t.navCouncil}
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 text-xs font-bold">
              <Link
                href="/"
                className={`px-2.5 py-1 rounded-full transition ${
                  locale === "pt" ? "bg-white text-cyan-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.langPt}
              </Link>
              <Link
                href="/en"
                className={`px-2.5 py-1 rounded-full transition ${
                  locale === "en" ? "bg-white text-cyan-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {t.langEn}
              </Link>
            </div>
            {acceptingMembers && (
              <Button
                onClick={() => setIsOpenForm(true)}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md text-xs sm:text-sm font-semibold rounded-full px-4 sm:px-5 py-2 transition transform hover:scale-105"
              >
                {t.becomeMember}
              </Button>
            )}
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
            {acceptingMembers ? (
              <Button
                onClick={() => setIsOpenForm(true)}
                className="px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-base sm:text-lg font-bold rounded-full shadow-lg transition-transform duration-300 hover:scale-[1.03]"
              >
                {t.joinLeague}
              </Button>
            ) : null}
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

      {/* Mission + logo */}
      <section ref={missionRef} className="container mx-auto max-w-6xl scroll-mt-20 px-4 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-14">
          <div className="space-y-5 text-left">
            <Badge className="bg-cyan-100 text-cyan-800 border-0">{t.foundationsBadge}</Badge>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              {t.ourMission}
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-slate-600 md:text-lg">
              <p>{t.missionP1}</p>
              <p>{t.missionP2}</p>
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
              <Badge className="bg-amber-100 text-amber-900 border-0 mb-2">{t.representBadge}</Badge>
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

          <div className="text-center mb-8 max-w-xl mx-auto">
            <p className="text-sm text-slate-500 leading-relaxed">{activeDepartment.description}</p>
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

      {/* Membership CTA */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-3xl">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-200/60 w-full space-y-6">
          {acceptingMembers ? (
            <>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.ctaTitle}</h2>
              <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                {t.ctaBody}
              </p>
              <Button
                onClick={() => setIsOpenForm(true)}
                className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {t.becomeMemberCta}
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.ctaClosedTitle}</h2>
              <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
                {t.ctaClosedBody}
              </p>
              <Button
                onClick={scrollToNewsletter}
                className="px-12 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-xl font-bold rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                {t.ctaClosedAction}
              </Button>
            </>
          )}
        </div>
      </section>

      {/* SECTION: NEWSLETTERS & SUBSCRIPTION (Centerpiece) */}
      <section ref={newsletterRef} className="container mx-auto px-4 py-20 max-w-5xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 text-white p-8 md:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
            {/* Left Column: Info & Subscription Form */}
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-300 text-xs font-semibold">
                <Mail className="w-3.5 h-3.5" />
                <span>{t.newsletterBadge}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {t.newsletterTitle}
              </h2>
              <p className="text-slate-300 text-sm md:text-base leading-relaxed">
                {t.newsletterBody}
              </p>

              <form onSubmit={handleSubscribe} className="space-y-3 pt-2">
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

            {/* Right Column: Recent Issues */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-cyan-300">{t.recentIssues}</h3>
              {newsletters.length === 0 ? (
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10 text-center text-slate-400 text-xs">
                  {t.noIssues}
                </div>
              ) : (
                <div className="space-y-3">
                  {newsletters.slice(0, 2).map((nl) => (
                    <div
                      key={nl.id}
                      className="p-4 rounded-2xl bg-white/10 border border-white/15 hover:bg-white/15 transition backdrop-blur space-y-2"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <Badge className="bg-cyan-400/20 text-cyan-200 border-0">{nl.issue_number}</Badge>
                        <span className="text-slate-400">{new Date(nl.published_at).toLocaleDateString(t.dateLocale)}</span>
                      </div>
                      <h4 className="font-bold text-white text-sm line-clamp-1">{nl.title}</h4>
                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">{nl.summary}</p>
                      {nl.pdf_url && (
                        <a
                          href={nl.pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs text-cyan-300 hover:text-cyan-200 font-semibold pt-1"
                        >
                          {t.readIssue} <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <img src="/logo.png" alt="LADINT Logo" className="w-8 h-8 object-contain" />
            <div>
              <p className="font-bold text-slate-800 text-sm">{t.defaultClubName}</p>
              <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} LADINT &bull; {t.footerRights}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
            <span>{t.contact} {siteSettings.contactEmail || "ladint.contato@academico.br"}</span>
            <span>Instagram: {siteSettings.instagram || "@ladint.oficial"}</span>
            <Link href="/admin" className="text-cyan-600 hover:underline font-semibold">
              {t.adminControl}
            </Link>
          </div>
        </div>
      </footer>

      {/* Membership Application Modal */}
      {acceptingMembers && (
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t.applyTitle}</DialogTitle>
            <DialogDescription>
              {t.applyDescription}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleApplicationSubmit} className="space-y-4 py-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">{t.fullName}</label>
              <Input
                required
                placeholder={t.fullNamePlaceholder}
                value={appForm.name}
                onChange={(e) => setAppForm({ ...appForm, name: e.target.value })}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">{t.emailLabel}</label>
              <Input
                type="email"
                required
                placeholder={t.emailExample}
                value={appForm.email}
                onChange={(e) => setAppForm({ ...appForm, email: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">{t.phoneLabel}</label>
                <Input
                  placeholder={t.phonePlaceholder}
                  value={appForm.phone}
                  onChange={(e) => setAppForm({ ...appForm, phone: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">{t.courseLabel}</label>
                <Input
                  placeholder={t.coursePlaceholder}
                  value={appForm.course_semester}
                  onChange={(e) => setAppForm({ ...appForm, course_semester: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">{t.motivationLabel}</label>
              <Textarea
                rows={3}
                placeholder={t.motivationPlaceholder}
                value={appForm.motivation}
                onChange={(e) => setAppForm({ ...appForm, motivation: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsOpenForm(false)}>
                {t.cancel}
              </Button>
              <Button type="submit" disabled={appLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold">
                {appLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                {t.submitApplication}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      )}

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
