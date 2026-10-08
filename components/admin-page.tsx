"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BookOpen,
  Calendar,
  Mail,
  Users,
  Plus,
  Trash2,
  ExternalLink,
  Download,
  ArrowLeft,
  CheckCircle,
  FileText,
  Trophy,
  Loader2,
  Edit,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getAdminDictionary } from "@/lib/admin-i18n";
import { NEWSLETTER_ENABLED } from "@/lib/features";
import type { Locale } from "@/lib/i18n";

const adminDialogShell =
  "border-slate-700 bg-gradient-to-br from-cyan-900 via-blue-900 to-slate-950 text-white";
const adminDialogLabel = "text-xs font-semibold text-slate-300";
const adminDialogField =
  "border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus-visible:ring-cyan-400";
const adminDialogCancel =
  "border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white";
const adminDialogSubmit = "bg-cyan-500 text-slate-950 hover:bg-cyan-400";

export default function AdminPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getAdminDictionary(locale);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    clubName: t.defaultClubName,
    clubAcronym: "LADINT",
    tagline: t.defaultTagline,
    contactEmail: "ladint.contato@academico.br",
    instagram: "@ladint.oficial",
    linkedin: "linkedin.com/company/ladint",
    foundationYear: "2024",
    acceptingMembers: false,
    joinFormUrl: "",
  });
  const [savingJoinSettings, setSavingJoinSettings] = useState(false);

  // Modal form states
  const [newNewsletterOpen, setNewNewsletterOpen] = useState(false);
  const [newsletterForm, setNewsletterForm] = useState({
    title: "",
    issue_number: "",
    summary: "",
    content: "",
    published_at: new Date().toISOString().split("T")[0],
    pdf_url: "",
  });

  const [newSubscriberOpen, setNewSubscriberOpen] = useState(false);
  const [subscriberForm, setSubscriberForm] = useState({
    email: "",
    name: "",
  });

  const [articleDialogOpen, setArticleDialogOpen] = useState(false);
  const [editingArticleId, setEditingArticleId] = useState<number | null>(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    authors: "",
    journal: "",
    publication_date: new Date().toISOString().split("T")[0],
    abstract: "",
    doi_or_url: "",
    tags: "",
    pdf_url: "",
  });
  const [uploadingArticlePdf, setUploadingArticlePdf] = useState(false);

  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    event_name: "",
    location: "",
    event_date: new Date().toISOString().split("T")[0],
    description: "",
    image_url: "",
  });
  const [uploadingEventImage, setUploadingEventImage] = useState(false);

  const uploadFile = async (file: File, kind: "image" | "pdf") => {
    const body = new FormData();
    body.append("file", file);
    body.append("kind", kind);
    const res = await fetch("/api/upload", { method: "POST", body });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Upload failed");
    return data.url as string;
  };

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, subsRes, artsRes, evsRes, settingsRes] = await Promise.all([
        NEWSLETTER_ENABLED ? fetch("/api/newsletter") : Promise.resolve(null),
        NEWSLETTER_ENABLED ? fetch("/api/newsletter/subscribers") : Promise.resolve(null),
        fetch("/api/articles"),
        fetch("/api/events"),
        fetch("/api/settings?key=general"),
      ]);

      const [newsData, subsData, artsData, evsData, settingsData] = await Promise.all([
        newsRes ? newsRes.json() : Promise.resolve({ success: false }),
        subsRes ? subsRes.json() : Promise.resolve({ success: false }),
        artsRes.json(),
        evsRes.json(),
        settingsRes.json(),
      ]);

      if (newsData.success) setNewsletters(newsData.data || []);
      if (subsData.success) setSubscribers(subsData.data || []);
      if (artsData.success) setArticles(artsData.data || []);
      if (evsData.success) setEvents(evsData.data || []);
      if (settingsData.success && settingsData.data) {
        setSiteSettings({
          acceptingMembers: false,
          joinFormUrl: "",
          ...settingsData.data,
        });
      }
    } catch (err: any) {
      toast.error(t.loadError + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- Newsletter Handlers ---
  const handleCreateNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newsletterForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(t.newsletterPublished);
      setNewNewsletterOpen(false);
      setNewsletterForm({
        title: "",
        issue_number: "",
        summary: "",
        content: "",
        published_at: new Date().toISOString().split("T")[0],
        pdf_url: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteNewsletter = async (id: number) => {
    if (!confirm(t.confirmDeleteNewsletter)) return;
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(t.newsletterDeleted);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleAddSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subscriberForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(data.message);
      setNewSubscriberOpen(false);
      setSubscriberForm({ email: "", name: "" });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteSubscriber = async (id: number) => {
    if (!confirm(t.confirmRemoveSubscriber)) return;
    try {
      const res = await fetch(`/api/newsletter/subscribers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(t.subscriberRemoved);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      toast.info(t.noSubscribersExport);
      return;
    }
    const header = t.csvHeader;
    const rows = subscribers
      .map((s) => `${s.id},"${s.name || ""}",${s.email},${new Date(s.created_at).toLocaleDateString(t.dateLocale)},${s.is_active ? t.active : t.inactive}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inscritos-newsletter-ladint-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(t.csvExported);
  };

  // --- Scientific Articles Handlers ---
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = editingArticleId !== null;
      const url = isEdit ? `/api/articles/${editingArticleId}` : "/api/articles";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(articleForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(isEdit ? t.articleUpdated : t.articleCreated);
      setArticleDialogOpen(false);
      setEditingArticleId(null);
      setArticleForm({
        title: "",
        authors: "",
        journal: "",
        publication_date: new Date().toISOString().split("T")[0],
        abstract: "",
        doi_or_url: "",
        tags: "",
        pdf_url: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditArticle = (art: any) => {
    setEditingArticleId(art.id);
    setArticleForm({
      title: art.title,
      authors: art.authors,
      journal: art.journal,
      publication_date: new Date(art.publication_date).toISOString().split("T")[0],
      abstract: art.abstract,
      doi_or_url: art.doi_or_url || "",
      tags: Array.isArray(art.tags) ? art.tags.join(", ") : art.tags || "",
      pdf_url: art.pdf_url || "",
    });
    setArticleDialogOpen(true);
  };

  const handleArticlePdfUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingArticlePdf(true);
    try {
      const url = await uploadFile(file, "pdf");
      setArticleForm((prev) => ({ ...prev, pdf_url: url }));
      toast.success(t.uploadPdf);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingArticlePdf(false);
    }
  };

  const handleEventImageUpload = async (file: File | null) => {
    if (!file) return;
    setUploadingEventImage(true);
    try {
      const url = await uploadFile(file, "image");
      setEventForm((prev) => ({ ...prev, image_url: url }));
      toast.success(t.uploadImage);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingEventImage(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm(t.confirmDeleteArticle)) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(t.articleDeleted);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // --- Big Events Handlers ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEdit = editingEventId !== null;
      const url = isEdit ? `/api/events/${editingEventId}` : "/api/events";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventForm),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      toast.success(isEdit ? t.eventUpdated : t.eventCreated);
      setEventDialogOpen(false);
      setEditingEventId(null);
      setEventForm({
        title: "",
        event_name: "",
        location: "",
        event_date: new Date().toISOString().split("T")[0],
        description: "",
        image_url: "",
      });
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleEditEvent = (ev: any) => {
    setEditingEventId(ev.id);
    setEventForm({
      title: ev.title,
      event_name: ev.event_name,
      location: ev.location,
      event_date: new Date(ev.event_date).toISOString().split("T")[0],
      description: ev.description,
      image_url: ev.image_url || "",
    });
    setEventDialogOpen(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm(t.confirmDeleteEvent)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(t.eventDeleted);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const saveJoinSettings = async (next: typeof siteSettings) => {
    setSavingJoinSettings(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "general", value: next }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setSiteSettings(next);
      toast.success(t.joinFormSaved);
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    } finally {
      setSavingJoinSettings(false);
    }
  };

  const handleToggleAcceptingMembers = async (checked: boolean) => {
    const url = (siteSettings.joinFormUrl || "").trim();
    if (checked && !url) {
      toast.error(t.joinFormUrlRequired);
      return;
    }
    const prev = siteSettings;
    const next = { ...siteSettings, acceptingMembers: checked };
    setSiteSettings(next);
    try {
      await saveJoinSettings(next);
    } catch {
      setSiteSettings(prev);
    }
  };

  const handleSaveJoinFormUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = (siteSettings.joinFormUrl || "").trim();
    const next = {
      ...siteSettings,
      joinFormUrl: url,
      acceptingMembers: url ? !!siteSettings.acceptingMembers : false,
    };
    await saveJoinSettings(next);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success(t.logoutSuccess);
      router.replace(locale === "en" ? "/en/admin/login" : "/admin/login");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || t.logoutFailed);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      <Tabs defaultValue={NEWSLETTER_ENABLED ? "newsletters" : "articles"} className="space-y-0">
        <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
          <div className="relative w-full px-4 py-3">
            <Link
              href={t.homePath}
              className="absolute left-4 top-3.5 z-10 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-700 md:left-6 lg:left-8"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" />
              {t.backToSite}
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="absolute right-4 top-3.5 z-10 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600 md:right-6 lg:right-8"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {t.logout}
            </button>

            <div className="mx-auto flex max-w-7xl flex-col items-center gap-3">
              <Link
                href={t.homePath}
                className="bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-lg font-extrabold tracking-tight text-transparent"
              >
                LADINT
              </Link>

              <TabsList
                className={`grid h-auto w-full max-w-3xl gap-1 rounded-xl border border-slate-200 bg-slate-50 p-1 grid-cols-2 ${
                  NEWSLETTER_ENABLED ? "md:grid-cols-4" : "md:grid-cols-3"
                }`}
              >
                {NEWSLETTER_ENABLED && (
                  <TabsTrigger
                    value="newsletters"
                    className="px-3 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-cyan-700 data-[state=active]:shadow-sm sm:text-sm"
                  >
                    <Mail className="mr-1.5 h-4 w-4" />
                    {t.tabNewsletters}
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="articles"
                  className="px-3 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-cyan-700 data-[state=active]:shadow-sm sm:text-sm"
                >
                  <BookOpen className="mr-1.5 h-4 w-4" />
                  {t.tabArticles}
                </TabsTrigger>
                <TabsTrigger
                  value="events"
                  className="px-3 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-cyan-700 data-[state=active]:shadow-sm sm:text-sm"
                >
                  <Trophy className="mr-1.5 h-4 w-4" />
                  {t.tabEvents}
                </TabsTrigger>
                <TabsTrigger
                  value="applications"
                  className="px-3 py-2 text-xs data-[state=active]:bg-white data-[state=active]:text-cyan-700 data-[state=active]:shadow-sm sm:text-sm"
                >
                  <Users className="mr-1.5 h-4 w-4" />
                  {t.tabApplications}
                </TabsTrigger>
              </TabsList>
            </div>
          </div>
        </header>

        <main className="container mx-auto max-w-7xl px-4 py-8">
          {/* TAB: NEWSLETTERS & SUBSCRIBERS */}
          {NEWSLETTER_ENABLED && (
          <TabsContent value="newsletters" className="mt-0 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.statSubscribers}</p>
                  <h3 className="mt-1 text-3xl font-extrabold text-cyan-700">{subscribers.length}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">
                  <Mail className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            {/* Newsletter Issues */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">{t.newsletterIssuesTitle}</CardTitle>
                  <CardDescription>{t.newsletterIssuesDesc}</CardDescription>
                </div>
                <Dialog open={newNewsletterOpen} onOpenChange={setNewNewsletterOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      {t.newIssue}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`max-w-xl max-h-[90vh] overflow-y-auto ${adminDialogShell}`}>
                    <DialogHeader>
                      <DialogTitle className="text-white">{t.publishIssueTitle}</DialogTitle>
                      <DialogDescription className="text-slate-300">
                        {t.publishIssueDesc}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNewsletter} className="space-y-4 py-2">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className={adminDialogLabel}>{t.issueTitle}</label>
                          <Input
                            required
                            placeholder={t.issueTitlePlaceholder}
                            value={newsletterForm.title}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.issueId}</label>
                          <Input
                            required
                            placeholder={t.issueIdPlaceholder}
                            value={newsletterForm.issue_number}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, issue_number: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.publishDate}</label>
                          <Input
                            type="date"
                            required
                            value={newsletterForm.published_at}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, published_at: e.target.value })}
                            className={`${adminDialogField} [color-scheme:dark]`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.pdfLinkOptional}</label>
                          <Input
                            placeholder="https://..."
                            value={newsletterForm.pdf_url}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, pdf_url: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.summaryRequired}</label>
                        <Textarea
                          required
                          rows={3}
                          placeholder={t.summaryPlaceholder}
                          value={newsletterForm.summary}
                          onChange={(e) => setNewsletterForm({ ...newsletterForm, summary: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.fullContent}</label>
                        <Textarea
                          rows={5}
                          placeholder={t.fullContentPlaceholder}
                          value={newsletterForm.content}
                          onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setNewNewsletterOpen(false)} className={adminDialogCancel}>
                          {t.cancel}
                        </Button>
                        <Button type="submit" className={adminDialogSubmit}>
                          {t.publishNewsletter}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {newsletters.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">{t.noIssues}</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {newsletters.map((n) => (
                      <Card key={n.id} className="border border-slate-200 bg-slate-50/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-cyan-100 text-cyan-800 border-0">{n.issue_number}</Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(n.published_at).toLocaleDateString(t.dateLocale)}
                            </span>
                          </div>
                          <CardTitle className="text-lg font-bold text-slate-900 mt-2">{n.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-slate-600 space-y-3">
                          <p className="line-clamp-3">{n.summary}</p>
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            {n.pdf_url ? (
                              <a
                                href={n.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-cyan-600 hover:underline flex items-center"
                              >
                                <ExternalLink className="w-3.5 h-3.5 mr-1" />
                                {t.accessPdf}
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">{t.noPdf}</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNewsletter(n.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              {t.delete}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscribers List */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">{t.subscribersTitle}</CardTitle>
                  <CardDescription>
                    {t.subscribersDesc}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={exportSubscribersCSV} className="border-slate-300 text-white">
                    <Download className="w-4 h-4 mr-1.5" />
                    {t.exportCsv}
                  </Button>
                  <Dialog open={newSubscriberOpen} onOpenChange={setNewSubscriberOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-1.5" />
                        {t.addSubscriber}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className={adminDialogShell}>
                      <DialogHeader>
                        <DialogTitle className="text-white">{t.addSubscriberTitle}</DialogTitle>
                        <DialogDescription className="text-slate-300">{t.addSubscriberDesc}</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddSubscriber} className="space-y-4 py-2">
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.email}</label>
                          <Input
                            type="email"
                            required
                            placeholder={t.emailPlaceholder}
                            value={subscriberForm.email}
                            onChange={(e) => setSubscriberForm({ ...subscriberForm, email: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.nameOptional}</label>
                          <Input
                            placeholder={t.namePlaceholder}
                            value={subscriberForm.name}
                            onChange={(e) => setSubscriberForm({ ...subscriberForm, name: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setNewSubscriberOpen(false)} className={adminDialogCancel}>
                            {t.cancel}
                          </Button>
                          <Button type="submit" className={adminDialogSubmit}>
                            {t.saveSubscriber}
                          </Button>
                        </DialogFooter>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>{t.email}</TableHead>
                        <TableHead>{t.name}</TableHead>
                        <TableHead>{t.signupDate}</TableHead>
                        <TableHead>{t.status}</TableHead>
                        <TableHead className="text-right">{t.actions}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                            {t.noSubscribers}
                          </TableCell>
                        </TableRow>
                      ) : (
                        subscribers.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium text-slate-900">{s.email}</TableCell>
                            <TableCell className="text-slate-600">{s.name || "—"}</TableCell>
                            <TableCell className="text-slate-500 text-xs">
                              {new Date(s.created_at).toLocaleDateString(t.dateLocale)}
                            </TableCell>
                            <TableCell>
                              {s.is_active ? (
                                <Badge className="bg-emerald-100 text-emerald-800 border-0">{t.active}</Badge>
                              ) : (
                                <Badge variant="secondary">{t.inactive}</Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSubscriber(s.id)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          )}

          {/* TAB: SCIENTIFIC ARTICLES */}
          <TabsContent value="articles" className="mt-0 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.statArticles}</p>
                  <h3 className="mt-1 text-3xl font-extrabold text-blue-700">{articles.length}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <BookOpen className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">{t.articlesTitle}</CardTitle>
                  <CardDescription>
                    {t.articlesDesc}
                  </CardDescription>
                </div>
                <Dialog open={articleDialogOpen} onOpenChange={setArticleDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingArticleId(null);
                        setArticleForm({
                          title: "",
                          authors: "",
                          journal: "",
                          publication_date: new Date().toISOString().split("T")[0],
                          abstract: "",
                          doi_or_url: "",
                          tags: "",
                          pdf_url: "",
                        });
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t.newArticle}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${adminDialogShell}`}>
                    <DialogHeader>
                      <DialogTitle className="text-white">{editingArticleId ? t.editArticle : t.createArticle}</DialogTitle>
                      <DialogDescription className="text-slate-300">
                        {t.articleDialogDesc}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveArticle} className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.articleTitle}</label>
                        <Input
                          required
                          placeholder={t.articleTitlePlaceholder}
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.authors}</label>
                          <Input
                            required
                            placeholder={t.authorsPlaceholder}
                            value={articleForm.authors}
                            onChange={(e) => setArticleForm({ ...articleForm, authors: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.journal}</label>
                          <Input
                            required
                            placeholder={t.journalPlaceholder}
                            value={articleForm.journal}
                            onChange={(e) => setArticleForm({ ...articleForm, journal: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.publishDate}</label>
                          <Input
                            type="date"
                            required
                            value={articleForm.publication_date}
                            onChange={(e) => setArticleForm({ ...articleForm, publication_date: e.target.value })}
                            className={`${adminDialogField} [color-scheme:dark]`}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.doiOrLink}</label>
                          <Input
                            placeholder="https://doi.org/... ou https://..."
                            value={articleForm.doi_or_url}
                            onChange={(e) => setArticleForm({ ...articleForm, doi_or_url: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.tagsLabel}</label>
                        <Input
                          placeholder={t.tagsPlaceholder}
                          value={articleForm.tags}
                          onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.abstractLabel}</label>
                        <Textarea
                          required
                          rows={6}
                          placeholder={t.abstractPlaceholder}
                          value={articleForm.abstract}
                          onChange={(e) => setArticleForm({ ...articleForm, abstract: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <div className="space-y-2 rounded-xl border border-white/15 bg-white/5 p-3">
                        <label className={adminDialogLabel}>{t.articlePdf}</label>
                        <p className="text-xs text-slate-400">{t.articlePdfHelp}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400">
                            {uploadingArticlePdf ? (
                              <span className="flex items-center">
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                {t.uploadingFile}
                              </span>
                            ) : (
                              <span className="flex items-center">
                                <FileText className="mr-1.5 h-3.5 w-3.5" />
                                {t.uploadPdf}
                              </span>
                            )}
                            <input
                              type="file"
                              accept="application/pdf,.pdf"
                              className="hidden"
                              disabled={uploadingArticlePdf}
                              onChange={(e) => handleArticlePdfUpload(e.target.files?.[0] || null)}
                            />
                          </label>
                          {articleForm.pdf_url && (
                            <>
                              <span className="text-xs text-emerald-300">{t.fileAttached}</span>
                              <a
                                href={articleForm.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-semibold text-cyan-300 hover:underline"
                              >
                                {t.openPdf}
                              </a>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                onClick={() => setArticleForm({ ...articleForm, pdf_url: "" })}
                              >
                                {t.removeFile}
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setArticleDialogOpen(false)} className={adminDialogCancel}>
                          {t.cancel}
                        </Button>
                        <Button type="submit" className={adminDialogSubmit}>
                          {editingArticleId ? t.saveChanges : t.registerArticle}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {articles.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">{t.noArticles}</p>
                ) : (
                  <div className="space-y-4">
                    {articles.map((art) => (
                      <div
                        key={art.id}
                        className="p-5 rounded-xl border border-slate-200 bg-white hover:border-cyan-300 transition shadow-sm space-y-3"
                      >
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                          <div className="space-y-1 max-w-3xl">
                            <h4 className="text-lg font-bold text-slate-900 leading-snug">{art.title}</h4>
                            <p className="text-sm font-medium text-cyan-700">
                              {art.authors} &bull; <span className="text-slate-600 font-normal">{art.journal}</span>
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditArticle(art)}
                              className="h-8 text-xs border-slate-300"
                            >
                              <Edit className="w-3.5 h-3.5 mr-1" />
                              {t.edit}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteArticle(art.id)}
                              className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              {t.delete}
                            </Button>
                          </div>
                        </div>

                        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">{art.abstract}</p>

                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(art.tags) &&
                              art.tags.map((tag: string, idx: number) => (
                                <Badge key={idx} variant="secondary" className="bg-slate-100 text-slate-700 text-xs">
                                  {tag}
                                </Badge>
                              ))}
                          </div>
                          <div className="flex items-center space-x-3 text-slate-500">
                            <span>{t.publishedOn} {new Date(art.publication_date).toLocaleDateString(t.dateLocale)}</span>
                            {art.pdf_url && (
                              <a
                                href={art.pdf_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-600 hover:underline flex items-center font-medium"
                              >
                                {t.openPdf} <FileText className="w-3 h-3 ml-1" />
                              </a>
                            )}
                            {art.doi_or_url && (
                              <a
                                href={art.doi_or_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-600 hover:underline flex items-center font-medium"
                              >
                                {t.viewArticle} <ExternalLink className="w-3 h-3 ml-1" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: BIG EVENTS */}
          <TabsContent value="events" className="mt-0 space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardContent className="flex items-center justify-between p-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{t.statEvents}</p>
                  <h3 className="mt-1 text-3xl font-extrabold text-amber-600">{events.length}</h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Trophy className="h-6 w-6" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">{t.eventsTitle}</CardTitle>
                  <CardDescription>
                    {t.eventsDesc}
                  </CardDescription>
                </div>
                <Dialog open={eventDialogOpen} onOpenChange={setEventDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingEventId(null);
                        setEventForm({
                          title: "",
                          event_name: "",
                          location: "",
                          event_date: new Date().toISOString().split("T")[0],
                          description: "",
                          image_url: "",
                        });
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t.newEvent}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`max-w-2xl max-h-[90vh] overflow-y-auto ${adminDialogShell}`}>
                    <DialogHeader>
                      <DialogTitle className="text-white">{editingEventId ? t.editEvent : t.createEvent}</DialogTitle>
                      <DialogDescription className="text-slate-300">
                        {t.eventDialogDesc}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveEvent} className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.displayTitle}</label>
                        <Input
                          required
                          placeholder={t.displayTitlePlaceholder}
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.officialEventName}</label>
                          <Input
                            required
                            placeholder={t.officialEventNamePlaceholder}
                            value={eventForm.event_name}
                            onChange={(e) => setEventForm({ ...eventForm, event_name: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className={adminDialogLabel}>{t.location}</label>
                          <Input
                            required
                            placeholder={t.locationPlaceholder}
                            value={eventForm.location}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                            className={adminDialogField}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.eventDate}</label>
                        <Input
                          type="date"
                          required
                          value={eventForm.event_date}
                          onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                          className={`${adminDialogField} [color-scheme:dark]`}
                        />
                      </div>

                      <div className="space-y-2 rounded-xl border border-white/15 bg-white/5 p-3">
                        <label className={adminDialogLabel}>{t.imageUrl}</label>
                        <p className="text-xs text-slate-400">{t.imageUrlHelp}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="inline-flex cursor-pointer items-center rounded-lg bg-cyan-500 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400">
                            {uploadingEventImage ? (
                              <span className="flex items-center">
                                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                                {t.uploadingFile}
                              </span>
                            ) : (
                              <span className="flex items-center">{t.uploadImage}</span>
                            )}
                            <input
                              type="file"
                              accept="image/png,image/jpeg,image/jpg,image/webp,image/gif,.png,.jpg,.jpeg,.webp"
                              className="hidden"
                              disabled={uploadingEventImage}
                              onChange={(e) => handleEventImageUpload(e.target.files?.[0] || null)}
                            />
                          </label>
                          {eventForm.image_url && (
                            <>
                              <span className="text-xs text-emerald-300">{t.fileAttached}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs text-red-300 hover:bg-red-500/10 hover:text-red-200"
                                onClick={() => setEventForm({ ...eventForm, image_url: "" })}
                              >
                                {t.removeFile}
                              </Button>
                            </>
                          )}
                        </div>
                        {eventForm.image_url && (
                          <img
                            src={eventForm.image_url}
                            alt=""
                            className="mt-2 h-28 w-full rounded-lg object-cover"
                          />
                        )}
                      </div>

                      <div className="space-y-1">
                        <label className={adminDialogLabel}>{t.eventDescription}</label>
                        <Textarea
                          required
                          rows={5}
                          placeholder={t.eventDescriptionPlaceholder}
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                          className={adminDialogField}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEventDialogOpen(false)} className={adminDialogCancel}>
                          {t.cancel}
                        </Button>
                        <Button type="submit" className={adminDialogSubmit}>
                          {editingEventId ? t.saveChanges : t.registerEvent}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">{t.noEvents}</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((ev) => (
                      <Card key={ev.id} className="overflow-hidden border border-slate-200 bg-white flex flex-col justify-between">
                        <div>
                          {ev.image_url ? (
                            <div className="h-44 w-full overflow-hidden bg-slate-100">
                              <img
                                src={ev.image_url}
                                alt={ev.title}
                                className="w-full h-full object-cover hover:scale-105 transition duration-500"
                              />
                            </div>
                          ) : (
                            <div className="h-44 w-full bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white">
                              <Trophy className="w-12 h-12 opacity-80" />
                            </div>
                          )}
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                              <span>{new Date(ev.event_date).toLocaleDateString(t.dateLocale)}</span>
                              <span>{ev.location}</span>
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 leading-snug">{ev.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">{ev.description}</p>
                          </CardContent>
                        </div>
                        <div className="p-4 pt-0 border-t border-slate-100 flex items-center justify-end space-x-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(ev)}
                            className="h-8 text-xs border-slate-300"
                          >
                            <Edit className="w-3.5 h-3.5 mr-1" />
                            {t.edit}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            {t.delete}
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: MEMBERSHIP / GOOGLE FORM */}
          <TabsContent value="applications" className="mt-0 space-y-6">
            <Card className="overflow-hidden border-slate-200 bg-white shadow-sm">
              <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-xl text-slate-800">{t.applicationsTitle}</CardTitle>
                    <Badge
                      className={`border-0 text-xs font-semibold ${
                        siteSettings.acceptingMembers && siteSettings.joinFormUrl
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {siteSettings.acceptingMembers && siteSettings.joinFormUrl
                        ? t.applicationsOpen
                        : t.applicationsClosed}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">{t.applicationsDesc}</CardDescription>
                </div>

                <div className="flex shrink-0 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{t.acceptingMembers}</p>
                    <p className="text-xs text-slate-500">{t.acceptingMembersHelp}</p>
                  </div>
                  <Switch
                    checked={!!siteSettings.acceptingMembers}
                    onCheckedChange={handleToggleAcceptingMembers}
                    className="data-[state=checked]:bg-cyan-600 data-[state=unchecked]:bg-slate-300"
                  />
                </div>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSaveJoinFormUrl} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      {t.joinFormUrl}
                    </label>
                    <Input
                      type="url"
                      placeholder={t.joinFormUrlPlaceholder}
                      value={siteSettings.joinFormUrl || ""}
                      onChange={(e) =>
                        setSiteSettings({ ...siteSettings, joinFormUrl: e.target.value })
                      }
                      className="border-slate-200 bg-white text-slate-900"
                    />
                    <p className="text-xs text-slate-500">{t.joinFormUrlHelp}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      type="submit"
                      disabled={savingJoinSettings}
                      className="bg-cyan-600 text-white hover:bg-cyan-700"
                    >
                      {savingJoinSettings ? (
                        <span className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t.saveSettings}
                        </span>
                      ) : (
                        t.saveSettings
                      )}
                    </Button>

                    {!!siteSettings.joinFormUrl && (
                      <Button asChild type="button" variant="outline" className="border-slate-300">
                        <a
                          href={siteSettings.joinFormUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1.5 h-4 w-4" />
                          {t.openFormPreview}
                        </a>
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </main>
      </Tabs>
    </div>
  );
}
