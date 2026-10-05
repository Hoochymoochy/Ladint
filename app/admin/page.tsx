"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
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
  Settings,
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
  Eye,
} from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [newsletters, setNewsletters] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<any>({
    clubName: "Liga Acadêmica de Direito Internacional",
    clubAcronym: "LADINT",
    tagline: "Promover o estudo crítico e interdisciplinar do Direito Internacional à luz dos desafios globais da atualidade.",
    contactEmail: "ladint.contato@academico.br",
    instagram: "@ladint.oficial",
    linkedin: "linkedin.com/company/ladint",
    foundationYear: "2024",
    acceptingMembers: true,
  });

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
  });

  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState({
    title: "",
    event_name: "",
    location: "",
    event_date: new Date().toISOString().split("T")[0],
    description: "",
    achievements: "",
    image_url: "",
  });

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    try {
      const [newsRes, subsRes, artsRes, evsRes, appsRes, settingsRes] = await Promise.all([
        fetch("/api/newsletter"),
        fetch("/api/newsletter/subscribers"),
        fetch("/api/articles"),
        fetch("/api/events"),
        fetch("/api/apply"),
        fetch("/api/settings?key=general"),
      ]);

      const [newsData, subsData, artsData, evsData, appsData, settingsData] = await Promise.all([
        newsRes.json(),
        subsRes.json(),
        artsRes.json(),
        evsRes.json(),
        appsRes.json(),
        settingsRes.json(),
      ]);

      if (newsData.success) setNewsletters(newsData.data || []);
      if (subsData.success) setSubscribers(subsData.data || []);
      if (artsData.success) setArticles(artsData.data || []);
      if (evsData.success) setEvents(evsData.data || []);
      if (appsData.success) setApplications(appsData.data || []);
      if (settingsData.success && settingsData.data) {
        setSiteSettings(settingsData.data);
      }
    } catch (err: any) {
      toast.error("Erro ao carregar dados do banco Neon: " + err.message);
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

      toast.success("Edição da newsletter publicada com sucesso!");
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
    if (!confirm("Tem certeza que deseja excluir esta edição?")) return;
    try {
      const res = await fetch(`/api/newsletter/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Newsletter excluída!");
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
    if (!confirm("Remover este assinante?")) return;
    try {
      const res = await fetch(`/api/newsletter/subscribers?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Assinante removido.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const exportSubscribersCSV = () => {
    if (subscribers.length === 0) {
      toast.info("Nenhum assinante para exportar.");
      return;
    }
    const header = "ID,Nome,E-mail,Data de Cadastro,Status\n";
    const rows = subscribers
      .map((s) => `${s.id},"${s.name || ""}",${s.email},${new Date(s.created_at).toLocaleDateString("pt-BR")},${s.is_active ? "Ativo" : "Inativo"}`)
      .join("\n");
    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `inscritos-newsletter-ladint-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Arquivo CSV exportado com sucesso!");
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

      toast.success(isEdit ? "Artigo atualizado com sucesso!" : "Artigo cadastrado com sucesso!");
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
    });
    setArticleDialogOpen(true);
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm("Excluir este artigo científico?")) return;
    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Artigo excluído!");
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

      toast.success(isEdit ? "Evento atualizado com sucesso!" : "Evento cadastrado com sucesso!");
      setEventDialogOpen(false);
      setEditingEventId(null);
      setEventForm({
        title: "",
        event_name: "",
        location: "",
        event_date: new Date().toISOString().split("T")[0],
        description: "",
        achievements: "",
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
      achievements: ev.achievements || "",
      image_url: ev.image_url || "",
    });
    setEventDialogOpen(true);
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm("Excluir este evento?")) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Evento excluído!");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // --- Site Settings Handler ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "general", value: siteSettings }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Informações do clube salvas no Neon Postgres com sucesso!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  // --- Application Delete Handler ---
  const handleDeleteApplication = async (id: number) => {
    if (!confirm("Remover esta candidatura?")) return;
    try {
      const res = await fetch(`/api/apply?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      toast.success("Candidatura removida.");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-16">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center space-x-2 text-slate-500 hover:text-cyan-700 transition">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Voltar ao Site</span>
            </Link>
            <span className="text-slate-300">|</span>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 to-blue-700 bg-clip-text text-transparent">
                Painel Administrativo LADINT
              </span>
              <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200 text-xs">
                Neon Cloud Postgres
              </Badge>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchData}
              disabled={loading}
              className="border-slate-300 text-slate-700"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : "Atualizar Dados"}
            </Button>
            <Link href="/" target="_blank">
              <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                <Eye className="w-4 h-4 mr-1" />
                Ver Site ao Vivo
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white border-slate-200 shadow-sm hover:shadow transition">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Inscritos Newsletter</p>
                <h3 className="text-2xl font-extrabold text-cyan-700 mt-1">{subscribers.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600">
                <Mail className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow transition">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Artigos Publicados</p>
                <h3 className="text-2xl font-extrabold text-blue-700 mt-1">{articles.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                <BookOpen className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow transition">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Grandes Eventos</p>
                <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{events.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                <Trophy className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-200 shadow-sm hover:shadow transition">
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Candidaturas Membros</p>
                <h3 className="text-2xl font-extrabold text-emerald-700 mt-1">{applications.length}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users className="w-6 h-6" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Administration Tabs */}
        <Tabs defaultValue="newsletters" className="space-y-6">
          <TabsList className="bg-white p-1 border border-slate-200 rounded-xl grid grid-cols-2 md:grid-cols-5 h-auto">
            <TabsTrigger value="newsletters" className="py-2.5 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <Mail className="w-4 h-4 mr-2" />
              Newsletters & Inscritos
            </TabsTrigger>
            <TabsTrigger value="articles" className="py-2.5 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <BookOpen className="w-4 h-4 mr-2" />
              Artigos Científicos
            </TabsTrigger>
            <TabsTrigger value="events" className="py-2.5 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <Trophy className="w-4 h-4 mr-2" />
              Grandes Eventos
            </TabsTrigger>
            <TabsTrigger value="applications" className="py-2.5 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <Users className="w-4 h-4 mr-2" />
              Candidaturas
            </TabsTrigger>
            <TabsTrigger value="settings" className="py-2.5 data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700">
              <Settings className="w-4 h-4 mr-2" />
              Informações do Clube
            </TabsTrigger>
          </TabsList>

          {/* TAB: NEWSLETTERS & SUBSCRIBERS */}
          <TabsContent value="newsletters" className="space-y-6">
            {/* Newsletter Issues */}
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">Edições da Newsletter</CardTitle>
                  <CardDescription>Publique comunicados periódicos, artigos de opinião e informes da liga.</CardDescription>
                </div>
                <Dialog open={newNewsletterOpen} onOpenChange={setNewNewsletterOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Edição
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>Publicar Nova Edição da Newsletter</DialogTitle>
                      <DialogDescription>
                        Preencha as informações para divulgar no site oficial.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateNewsletter} className="space-y-4 py-2">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Título da Edição</label>
                          <Input
                            required
                            placeholder="Ex: Direito Internacional Ambiental e a COP30"
                            value={newsletterForm.title}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, title: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Identificador</label>
                          <Input
                            required
                            placeholder="Ex: Edição #03"
                            value={newsletterForm.issue_number}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, issue_number: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Data de Publicação</label>
                          <Input
                            type="date"
                            required
                            value={newsletterForm.published_at}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, published_at: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Link do PDF (Opcional)</label>
                          <Input
                            placeholder="https://..."
                            value={newsletterForm.pdf_url}
                            onChange={(e) => setNewsletterForm({ ...newsletterForm, pdf_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Resumo / Chamada (Obrigatório)</label>
                        <Textarea
                          required
                          rows={3}
                          placeholder="Breve descrição dos tópicos abordados nesta edição..."
                          value={newsletterForm.summary}
                          onChange={(e) => setNewsletterForm({ ...newsletterForm, summary: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Conteúdo Editorial Completo</label>
                        <Textarea
                          rows={5}
                          placeholder="Texto completo da newsletter (opcional se houver link para PDF)..."
                          value={newsletterForm.content}
                          onChange={(e) => setNewsletterForm({ ...newsletterForm, content: e.target.value })}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setNewNewsletterOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-cyan-600 text-white">
                          Publicar Newsletter
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {newsletters.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Nenhuma edição publicada ainda.</p>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {newsletters.map((n) => (
                      <Card key={n.id} className="border border-slate-200 bg-slate-50/50">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <Badge className="bg-cyan-100 text-cyan-800 border-0">{n.issue_number}</Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(n.published_at).toLocaleDateString("pt-BR")}
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
                                Acessar PDF
                              </a>
                            ) : (
                              <span className="text-xs text-slate-400">Sem anexo PDF</span>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteNewsletter(n.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
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
                  <CardTitle className="text-xl text-slate-800">Lista de Assinantes da Newsletter</CardTitle>
                  <CardDescription>
                    Pessoas que se inscreveram através da landing page ou foram adicionadas manualmente.
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={exportSubscribersCSV} className="text-slate-700 border-slate-300">
                    <Download className="w-4 h-4 mr-1.5" />
                    Exportar CSV
                  </Button>
                  <Dialog open={newSubscriberOpen} onOpenChange={setNewSubscriberOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                        <Plus className="w-4 h-4 mr-1.5" />
                        Adicionar Assinante
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Assinante Manualmente</DialogTitle>
                        <DialogDescription>Cadastre o e-mail de um novo leitor.</DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleAddSubscriber} className="space-y-4 py-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">E-mail</label>
                          <Input
                            type="email"
                            required
                            placeholder="exemplo@universidade.br"
                            value={subscriberForm.email}
                            onChange={(e) => setSubscriberForm({ ...subscriberForm, email: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Nome (Opcional)</label>
                          <Input
                            placeholder="Nome completo do leitor"
                            value={subscriberForm.name}
                            onChange={(e) => setSubscriberForm({ ...subscriberForm, name: e.target.value })}
                          />
                        </div>
                        <DialogFooter>
                          <Button type="button" variant="outline" onClick={() => setNewSubscriberOpen(false)}>
                            Cancelar
                          </Button>
                          <Button type="submit" className="bg-cyan-600 text-white">
                            Salvar Assinante
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
                        <TableHead>E-mail</TableHead>
                        <TableHead>Nome</TableHead>
                        <TableHead>Data de Inscrição</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                            Nenhum inscrito registrado ainda.
                          </TableCell>
                        </TableRow>
                      ) : (
                        subscribers.map((s) => (
                          <TableRow key={s.id}>
                            <TableCell className="font-medium text-slate-900">{s.email}</TableCell>
                            <TableCell className="text-slate-600">{s.name || "—"}</TableCell>
                            <TableCell className="text-slate-500 text-xs">
                              {new Date(s.created_at).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell>
                              {s.is_active ? (
                                <Badge className="bg-emerald-100 text-emerald-800 border-0">Ativo</Badge>
                              ) : (
                                <Badge variant="secondary">Inativo</Badge>
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

          {/* TAB: SCIENTIFIC ARTICLES */}
          <TabsContent value="articles" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">Artigos Científicos Publicados</CardTitle>
                  <CardDescription>
                    Gerencie a produção acadêmica dos pesquisadores e membros da LADINT.
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
                        });
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Artigo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingArticleId ? "Editar Artigo Científico" : "Cadastrar Artigo Científico"}</DialogTitle>
                      <DialogDescription>
                        Informe os metadados bibliográficos do artigo publicado.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveArticle} className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Título do Artigo</label>
                        <Input
                          required
                          placeholder="Ex: A Eficácia das Medidas Provisórias na Corte Interamericana..."
                          value={articleForm.title}
                          onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Autores</label>
                          <Input
                            required
                            placeholder="Ex: Mila Antunes, Letícia Belo"
                            value={articleForm.authors}
                            onChange={(e) => setArticleForm({ ...articleForm, authors: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Periódico / Revista Científica</label>
                          <Input
                            required
                            placeholder="Ex: Revista Brasileira de Direito Internacional"
                            value={articleForm.journal}
                            onChange={(e) => setArticleForm({ ...articleForm, journal: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Data de Publicação</label>
                          <Input
                            type="date"
                            required
                            value={articleForm.publication_date}
                            onChange={(e) => setArticleForm({ ...articleForm, publication_date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">DOI ou Link Externo</label>
                          <Input
                            placeholder="https://doi.org/... ou https://..."
                            value={articleForm.doi_or_url}
                            onChange={(e) => setArticleForm({ ...articleForm, doi_or_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Palavras-chave / Tags (separadas por vírgula)</label>
                        <Input
                          placeholder="Direitos Humanos, Corte IDH, Litígio Climático"
                          value={articleForm.tags}
                          onChange={(e) => setArticleForm({ ...articleForm, tags: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Resumo / Abstract</label>
                        <Textarea
                          required
                          rows={6}
                          placeholder="Texto completo do resumo acadêmico..."
                          value={articleForm.abstract}
                          onChange={(e) => setArticleForm({ ...articleForm, abstract: e.target.value })}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setArticleDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-cyan-600 text-white">
                          {editingArticleId ? "Salvar Alterações" : "Cadastrar Artigo"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {articles.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Nenhum artigo cadastrado ainda.</p>
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
                              Editar
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteArticle(art.id)}
                              className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Excluir
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
                            <span>Publicado em: {new Date(art.publication_date).toLocaleDateString("pt-BR")}</span>
                            {art.doi_or_url && (
                              <a
                                href={art.doi_or_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-cyan-600 hover:underline flex items-center font-medium"
                              >
                                Ver Artigo <ExternalLink className="w-3 h-3 ml-1" />
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
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-xl text-slate-800">Participação em Grandes Eventos</CardTitle>
                  <CardDescription>
                    Registre a atuação da LADINT em Moot Courts, conferências internacionais, simpósios e simulações da ONU.
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
                          achievements: "",
                          image_url: "",
                        });
                      }}
                      className="bg-cyan-600 hover:bg-cyan-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>{editingEventId ? "Editar Evento" : "Cadastrar Participação em Evento"}</DialogTitle>
                      <DialogDescription>
                        Destaque os resultados, premiações e fotos da participação do clube.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSaveEvent} className="space-y-4 py-2">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Título de Exibição</label>
                        <Input
                          required
                          placeholder="Ex: Philip C. Jessup International Law Moot Court"
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Nome Oficial do Evento</label>
                          <Input
                            required
                            placeholder="Ex: Jessup Moot Court 2025"
                            value={eventForm.event_name}
                            onChange={(e) => setEventForm({ ...eventForm, event_name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Local / Cidade</label>
                          <Input
                            required
                            placeholder="Ex: Brasília - DF / Washington D.C."
                            value={eventForm.location}
                            onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">Data de Realização</label>
                          <Input
                            type="date"
                            required
                            value={eventForm.event_date}
                            onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-600">URL da Imagem / Foto</label>
                          <Input
                            placeholder="https://images.unsplash.com/... ou /foto.jpg"
                            value={eventForm.image_url}
                            onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Conquistas / Premiações / Destaques</label>
                        <Input
                          placeholder="Ex: Prêmio de Melhor Memorial Escrito e Menção Honrosa"
                          value={eventForm.achievements}
                          onChange={(e) => setEventForm({ ...eventForm, achievements: e.target.value })}
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600">Descrição Detalhada da Participação</label>
                        <Textarea
                          required
                          rows={5}
                          placeholder="Relato sobre a delegação da liga, temas debatidos e relevância acadêmica..."
                          value={eventForm.description}
                          onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                        />
                      </div>

                      <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setEventDialogOpen(false)}>
                          Cancelar
                        </Button>
                        <Button type="submit" className="bg-cyan-600 text-white">
                          {editingEventId ? "Salvar Alterações" : "Cadastrar Evento"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-center text-slate-500 py-8">Nenhum evento registrado ainda.</p>
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
                              <span>{new Date(ev.event_date).toLocaleDateString("pt-BR")}</span>
                              <span>{ev.location}</span>
                            </div>
                            <CardTitle className="text-lg font-bold text-slate-900 leading-snug">{ev.title}</CardTitle>
                            {ev.achievements && (
                              <Badge className="bg-amber-100 text-amber-900 border-amber-200 mt-2 font-medium">
                                🏆 {ev.achievements}
                              </Badge>
                            )}
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
                            Editar
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteEvent(ev.id)}
                            className="h-8 text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Excluir
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB: CANDIDATURAS DE MEMBROS */}
          <TabsContent value="applications" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Candidaturas de Novos Membros</CardTitle>
                <CardDescription>
                  Estudantes que preencheram o formulário "Torne-se um membro" no site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Nome</TableHead>
                        <TableHead>E-mail</TableHead>
                        <TableHead>Telefone / WhatsApp</TableHead>
                        <TableHead>Curso & Semestre</TableHead>
                        <TableHead>Motivação</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-slate-500 py-6">
                            Nenhuma candidatura enviada até o momento.
                          </TableCell>
                        </TableRow>
                      ) : (
                        applications.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-semibold text-slate-900">{app.name}</TableCell>
                            <TableCell className="text-slate-700">{app.email}</TableCell>
                            <TableCell className="text-slate-600">{app.phone || "—"}</TableCell>
                            <TableCell className="text-slate-600">{app.course_semester || "Direito"}</TableCell>
                            <TableCell className="text-slate-600 max-w-xs truncate" title={app.motivation}>
                              {app.motivation || "Sem observações adicionais"}
                            </TableCell>
                            <TableCell className="text-slate-500 text-xs">
                              {new Date(app.created_at).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteApplication(app.id)}
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

          {/* TAB: SITE SETTINGS */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white border-slate-200 shadow-sm max-w-3xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl text-slate-800">Informações Institucionais do Clube</CardTitle>
                <CardDescription>
                  Configure dados gerais exibidos no cabeçalho, rodapé e seções informativas do site.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Nome da Liga / Clube</label>
                      <Input
                        value={siteSettings.clubName || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, clubName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Sigla</label>
                      <Input
                        value={siteSettings.clubAcronym || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, clubAcronym: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-600">Lema / Missão Principal</label>
                    <Textarea
                      rows={3}
                      value={siteSettings.tagline || ""}
                      onChange={(e) => setSiteSettings({ ...siteSettings, tagline: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">E-mail de Contato Oficial</label>
                      <Input
                        type="email"
                        value={siteSettings.contactEmail || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, contactEmail: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Ano de Fundação</label>
                      <Input
                        value={siteSettings.foundationYear || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, foundationYear: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">Instagram</label>
                      <Input
                        placeholder="@ladint.oficial"
                        value={siteSettings.instagram || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, instagram: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600">LinkedIn</label>
                      <Input
                        placeholder="linkedin.com/company/ladint"
                        value={siteSettings.linkedin || ""}
                        onChange={(e) => setSiteSettings({ ...siteSettings, linkedin: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 space-y-2">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                        checked={!!siteSettings.acceptingMembers}
                        onChange={(e) =>
                          setSiteSettings({ ...siteSettings, acceptingMembers: e.target.checked })
                        }
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          Aceitando novos membros
                        </span>
                        <span className="block text-xs text-slate-500 mt-0.5">
                          Quando ativo, o botão de candidatura aparece no site. Quando desativado, o
                          público vê o aviso de inscrição fechada e o convite para a newsletter.
                        </span>
                      </span>
                    </label>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white">
                      Salvar Informações no Neon
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
