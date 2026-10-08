"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, ExternalLink, ArrowLeft, FileText } from "lucide-react";
import { getDictionary, type Locale } from "@/lib/i18n";
import SiteFooter from "@/components/site-footer";

export default function ArticlesPage({ locale = "pt" }: { locale?: Locale }) {
  const t = getDictionary(locale);
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any>(null);

  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
  }, [t.htmlLang]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/articles");
        const data = await res.json();
        if (data.success && data.data) setArticles(data.data);
      } catch (err) {
        console.error("Error loading articles:", err);
      }
    }
    load();
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-white via-[#f7fbfe] to-[#edf6fc] text-slate-800">
      <nav className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <Link href={t.homePath} className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-cyan-700">
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

      <main className="container mx-auto w-full max-w-6xl flex-1 px-4 py-14">
        <div className="mb-10 max-w-2xl">
          <Badge className="mb-2 border-0 bg-blue-100 text-blue-800">{t.academicBadge}</Badge>
          <h1 className="text-3xl font-extrabold text-slate-900 md:text-4xl">{t.articlesTitle}</h1>
          <p className="mt-2 text-sm text-slate-600 md:text-base">{t.articlesSubtitle}</p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/60 py-16 text-center">
            <BookOpen className="mx-auto mb-2 h-10 w-10 text-slate-400" />
            <p className="text-slate-500">{t.noArticles}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((art) => (
              <Card
                key={art.id}
                className="flex flex-col justify-between rounded-2xl border-slate-200/80 bg-white/90 shadow-md backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <CardHeader className="pb-3">
                    <div className="mb-2 flex items-center justify-between text-xs text-slate-500">
                      <span className="max-w-[180px] truncate font-semibold text-cyan-700">{art.journal}</span>
                      <span>{new Date(art.publication_date).toLocaleDateString(t.dateLocale)}</span>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg font-bold leading-snug text-slate-900 transition hover:text-cyan-700">
                      {art.title}
                    </CardTitle>
                    <CardDescription className="mt-1 text-xs font-medium text-slate-600">
                      {t.byAuthors} {art.authors}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="line-clamp-4 text-xs leading-relaxed text-slate-600">{art.abstract}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {Array.isArray(art.tags) &&
                        art.tags.slice(0, 3).map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </CardContent>
                </div>

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 p-5 pt-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedArticle(art)}
                    className="p-0 text-xs font-semibold text-cyan-600 hover:text-cyan-800"
                  >
                    {t.readAbstract}
                  </Button>
                  <div className="flex items-center gap-3">
                    {art.pdf_url && (
                      <a
                        href={art.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-cyan-700 transition hover:text-cyan-600"
                      >
                        {t.openPdf} <FileText className="ml-1 h-3.5 w-3.5" />
                      </a>
                    )}
                    {art.doi_or_url && (
                      <a
                        href={art.doi_or_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center text-xs font-semibold text-slate-700 transition hover:text-cyan-600"
                      >
                        {t.access} <ExternalLink className="ml-1 h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <SiteFooter locale={locale} />

      {selectedArticle && (
        <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
          <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
            <DialogHeader>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <Badge className="border-0 bg-blue-100 text-blue-800">{selectedArticle.journal}</Badge>
                <span>{new Date(selectedArticle.publication_date).toLocaleDateString(t.dateLocale)}</span>
              </div>
              <DialogTitle className="text-xl font-bold leading-snug text-slate-900">
                {selectedArticle.title}
              </DialogTitle>
              <DialogDescription className="text-xs font-semibold text-cyan-700">
                {t.authorsLabel} {selectedArticle.authors}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-500">{t.abstractLabel}</h4>
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-700">{selectedArticle.abstract}</p>
              </div>

              {Array.isArray(selectedArticle.tags) && selectedArticle.tags.length > 0 && (
                <div>
                  <h4 className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">{t.keywordsLabel}</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedArticle.tags.map((tagItem: string, i: number) => (
                      <Badge key={i} variant="secondary" className="bg-slate-100 text-xs text-slate-700">
                        {tagItem}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {(selectedArticle.pdf_url || selectedArticle.doi_or_url) && (
                <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-2">
                  {selectedArticle.pdf_url && (
                    <a
                      href={selectedArticle.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg bg-cyan-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-cyan-700"
                    >
                      {t.openPdf} <FileText className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  )}
                  {selectedArticle.doi_or_url && (
                    <a
                      href={selectedArticle.doi_or_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-cyan-300 hover:text-cyan-700"
                    >
                      {t.accessFullArticle} <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
