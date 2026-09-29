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
  Shield,
  Users,
  Globe,
  Scale,
  BookOpen,
  Trophy,
  Mail,
  ExternalLink,
  ChevronRight,
  CheckCircle2,
  Lock,
  Loader2,
  Award,
  Send,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function LandingPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Dynamic Data from Neon Postgres
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    clubName: t.defaultClubName,
    clubAcronym: "LADINT",
    tagline: t.defaultTagline,
    contactEmail: "ladint.contato@academico.br",
    instagram: "@ladint.oficial",
    linkedin: "linkedin.com/company/ladint",
  });

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  // Hero Video Control (stop & freeze at 7 seconds)
  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isFrozen, setIsFrozen] = useState(false);

  useEffect(() => {
    const video = heroVideoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});

    let animId: number;

    const checkTime = () => {
      if (video.currentTime >= 7) {
        video.pause();
        video.currentTime = 7;
        setIsFrozen(true);
        return;
      }
      animId = requestAnimationFrame(checkTime);
    };

    const handlePlay = () => {
      setIsFrozen(false);
      cancelAnimationFrame(animId);
      animId = requestAnimationFrame(checkTime);
    };

    const handleEnded = () => {
      video.pause();
      video.currentTime = 7;
      setIsFrozen(true);
    };

    video.addEventListener("play", handlePlay);
    video.addEventListener("ended", handleEnded);

    if (!video.paused) {
      handlePlay();
    }

    return () => {
      cancelAnimationFrame(animId);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (heroVideoRef.current && heroVideoRef.current.currentTime >= 7) {
      heroVideoRef.current.pause();
      heroVideoRef.current.currentTime = 7;
      setIsFrozen(true);
    }
  };

  const handleReplay = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0;
      heroVideoRef.current.play().catch(() => {});
      setIsFrozen(false);
    }
  };

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

  // Section Refs for smooth scrolling
  const missionRef = useRef<HTMLDivElement | null>(null);
  const articlesRef = useRef<HTMLDivElement | null>(null);
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const newsletterRef = useRef<HTMLDivElement | null>(null);
  const councilRef = useRef<HTMLDivElement | null>(null);

  // Fetch data from Neon DB
  useEffect(() => {
    async function loadData() {
      try {
        const [artsRes, evsRes, newsRes, settingsRes] = await Promise.all([
          fetch("/api/articles"),
          fetch("/api/events"),
          fetch("/api/newsletter"),
          fetch("/api/settings?key=general"),
        ]);

        const [artsData, evsData, newsData, settingsData] = await Promise.all([
          artsRes.json(),
          evsRes.json(),
          newsRes.json(),
          settingsRes.json(),
        ]);

        if (artsData.success && artsData.data) setArticles(artsData.data);
        if (evsData.success && evsData.data) setEvents(evsData.data);
        if (newsData.success && newsData.data) setNewsletters(newsData.data);
        if (settingsData.success && settingsData.data) {
          const data = settingsData.data;
          setSiteSettings({
            ...data,
            // Keep English UI defaults for display name/tagline (CMS is Portuguese today)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#f7fbfe] to-[#edf6fc] text-slate-800">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
            <button
              onClick={() => articlesRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-600 transition flex items-center"
            >
              {t.navArticles}
              {articles.length > 0 && (
                <span className="ml-1.5 px-1.5 py-0.2 bg-cyan-100 text-cyan-800 text-[10px] font-bold rounded-full">
                  {articles.length}
                </span>
              )}
            </button>
            <button
              onClick={() => eventsRef.current?.scrollIntoView({ behavior: "smooth" })}
              className="hover:text-cyan-600 transition"
            >
              {t.navEvents}
            </button>
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
            <Button
              onClick={() => setIsOpenForm(true)}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-md text-xs sm:text-sm font-semibold rounded-full px-4 sm:px-5 py-2 transition transform hover:scale-105"
            >
              {t.becomeMember}
            </Button>
            <Link href="/admin">
              <Button variant="outline" size="sm" className="border-slate-300 text-slate-700 hover:text-cyan-700 text-xs">
                <Lock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                {t.adminPanel}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24 flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.cyan.100),white)] opacity-60" />
        <div className="container mx-auto px-4 flex flex-col items-center text-center space-y-6 max-w-4xl">
          {/* Hero Video (gemini_generated_video_83ea9187.mp4) - Stops & Freezes at 7 Seconds */}
          <div className="relative group mx-auto my-2 w-full max-w-sm sm:max-w-md md:max-w-lg flex flex-col items-center">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border-2 border-cyan-200/90 bg-white/80 backdrop-blur-md transition-all duration-500 hover:shadow-cyan-200/70">
              <video
                ref={heroVideoRef}
                src="/gemini_generated_video_83ea9187.mp4"
                poster="/logo.png"
                autoPlay
                muted
                playsInline
                preload="auto"
                className="w-full h-full object-contain cursor-pointer transition-transform duration-300 group-hover:scale-[1.02]"
                onClick={handleReplay}
                onTimeUpdate={handleTimeUpdate}
              />

              {/* Status and Replay Overlay */}
              <div className="absolute bottom-3 right-3 flex items-center space-x-2 transition-all duration-300">
                <button
                  type="button"
                  onClick={handleReplay}
                  className="px-3.5 py-1.5 bg-black/70 hover:bg-black/90 backdrop-blur-md text-white text-xs font-semibold rounded-full flex items-center space-x-1.5 shadow-lg transition transform hover:scale-105 active:scale-95"
                  title={t.replayTitle}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{isFrozen ? t.replayFrozen : t.replayLive}</span>
                </button>
              </div>

              {isFrozen && (
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-cyan-600/90 backdrop-blur-md text-white text-[10px] font-bold rounded-full uppercase tracking-wider shadow">
                    LADINT
                  </span>
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2.5 font-medium flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
              <span>{t.animationCaption}</span>
              <span className="text-slate-300">&bull;</span>
              <span>{t.animationPause}</span>
            </p>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {siteSettings.clubName || t.defaultClubName}
          </h1>

          <p className="text-lg md:text-2xl text-slate-600 max-w-2xl leading-relaxed">
            {siteSettings.tagline || t.defaultTagline}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Button
              onClick={() => setIsOpenForm(true)}
              className="px-8 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white text-lg font-bold rounded-full shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t.joinLeague}
            </Button>
            <Button
              onClick={() => newsletterRef.current?.scrollIntoView({ behavior: "smooth" })}
              variant="outline"
              className="px-8 py-6 border-slate-300 bg-white/80 hover:bg-slate-50 text-slate-700 text-lg font-semibold rounded-full shadow-sm"
            >
              {t.subscribeNewsletter} <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>

          {/* Quick Highlight Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 w-full max-w-3xl">
            <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-slate-200/60">
              <span className="text-3xl font-extrabold text-cyan-600">{articles.length || "3"}+</span>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.statArticles}</p>
            </div>
            <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-slate-200/60">
              <span className="text-3xl font-extrabold text-blue-600">{events.length || "3"}+</span>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.statEvents}</p>
            </div>
            <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-slate-200/60">
              <span className="text-3xl font-extrabold text-amber-500">Moot</span>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.statMoot}</p>
            </div>
            <div className="p-4 bg-white/70 backdrop-blur rounded-2xl shadow-sm border border-slate-200/60">
              <span className="text-3xl font-extrabold text-emerald-600">ONU</span>
              <p className="text-xs text-slate-500 font-medium mt-1">{t.statUn}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Goals */}
      <section ref={missionRef} className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="text-center mb-12">
          <Badge className="bg-cyan-100 text-cyan-800 border-0 mb-2">{t.foundationsBadge}</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.missionTitle}</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-white/90 backdrop-blur shadow-md border-0 rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center mb-2">
                <Globe className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">{t.ourMission}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 leading-relaxed space-y-3">
              <p>{t.missionP1}</p>
              <p>{t.missionP2}</p>
            </CardContent>
          </Card>

          <Card className="bg-white/90 backdrop-blur shadow-md border-0 rounded-2xl hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                <Scale className="w-6 h-6" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900">{t.pillarsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-slate-700">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <span className="text-sm">{t.pillar1}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <span className="text-sm">{t.pillar2}</span>
              </div>
              <div className="flex items-start space-x-3">
                <Trophy className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <span className="text-sm">{t.pillar3}</span>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpen className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-sm">{t.pillar4}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION: PUBLISHED SCIENTIFIC ARTICLES */}
      <section ref={articlesRef} className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge className="bg-blue-100 text-blue-800 border-0 mb-2">{t.academicBadge}</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.articlesTitle}</h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              {t.articlesSubtitle}
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
              {t.manageArticles}
            </Button>
          </Link>
        </div>

        {articles.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-slate-200">
            <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">{t.noArticles}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((art) => (
              <Card
                key={art.id}
                className="bg-white/90 backdrop-blur border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between rounded-2xl hover:-translate-y-1"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                      <span className="font-semibold text-cyan-700 truncate max-w-[180px]">{art.journal}</span>
                      <span>{new Date(art.publication_date).toLocaleDateString(t.dateLocale)}</span>
                    </div>
                    <CardTitle className="text-lg font-bold text-slate-900 leading-snug line-clamp-2 hover:text-cyan-700 transition">
                      {art.title}
                    </CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-600 mt-1">
                      {t.byAuthors} {art.authors}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed">{art.abstract}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Array.isArray(art.tags) &&
                        art.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedArticle(art)}
                    className="text-xs text-cyan-600 hover:text-cyan-800 p-0 font-semibold"
                  >
                    {t.readAbstract}
                  </Button>
                  {art.doi_or_url && (
                    <a
                      href={art.doi_or_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-slate-700 hover:text-cyan-600 transition"
                    >
                      {t.access} <ExternalLink className="w-3.5 h-3.5 ml-1" />
                    </a>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* SECTION: PARTICIPATION IN BIG EVENTS */}
      <section ref={eventsRef} className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge className="bg-amber-100 text-amber-900 border-0 mb-2">{t.representBadge}</Badge>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.eventsTitle}</h2>
            <p className="text-slate-600 text-sm mt-1 max-w-xl">
              {t.eventsSubtitle}
            </p>
          </div>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="border-slate-300 text-slate-700">
              {t.manageEvents}
            </Button>
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12 bg-white/60 rounded-2xl border border-slate-200">
            <Trophy className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-500">{t.noEvents}</p>
          </div>
        ) : (
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
        )}
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

      {/* Council Section */}
      <section ref={councilRef} className="container mx-auto px-4 py-20 max-w-6xl">
        <div className="text-center mb-12">
          <Badge className="bg-cyan-100 text-cyan-800 border-0 mb-2">{t.leadershipBadge}</Badge>
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">{t.councilTitle}</h2>
          <p className="text-slate-600 text-sm mt-1 max-w-lg mx-auto">
            {t.councilSubtitle}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {councilMembers.map((member, i) => (
            <Card
              key={i}
              className="text-center bg-white/90 backdrop-blur shadow-md rounded-2xl hover:shadow-xl transition-all duration-300 border-slate-200/80 p-5 flex flex-col justify-between"
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
      </section>

      {/* Become a Member - Centerpiece CTA */}
      <section className="container mx-auto px-4 py-20 flex flex-col items-center text-center max-w-3xl">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-transparent border border-cyan-200/60 w-full space-y-6">
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

      {/* Article Detail Modal */}
      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <Badge className="bg-blue-100 text-blue-800 border-0">{selectedArticle.journal}</Badge>
                <span>{new Date(selectedArticle.publication_date).toLocaleDateString(t.dateLocale)}</span>
              </div>
              <DialogTitle className="text-xl font-bold text-slate-900 leading-snug">
                {selectedArticle.title}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-cyan-700">
                {t.authorsLabel} {selectedArticle.authors}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{t.abstractLabel}</h4>
                <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{selectedArticle.abstract}</p>
              </div>

              {Array.isArray(selectedArticle.tags) && selectedArticle.tags.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">{t.keywordsLabel}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.tags.map((tagItem: string, i: number) => (
                      <Badge key={i} variant="secondary" className="text-xs bg-slate-100 text-slate-700">
                        {tagItem}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedArticle.doi_or_url && (
                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <a
                    href={selectedArticle.doi_or_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-xs font-semibold shadow-sm transition"
                  >
                    {t.accessFullArticle} <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                  </a>
                </div>
              )}
            </div>
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
