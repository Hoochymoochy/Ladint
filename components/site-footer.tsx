"use client";

import Link from "next/link";
import { getDictionary, type Locale } from "@/lib/i18n";

export default function SiteFooter({
  locale = "pt",
  contactEmail = "ladint.contato@academico.br",
  instagram = "@ladint.oficial",
}: {
  locale?: Locale;
  contactEmail?: string;
  instagram?: string;
}) {
  const t = getDictionary(locale);

  return (
    <footer className="border-t border-slate-200/80 bg-white py-12 px-4">
      <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center space-x-3">
          <img src="/assests/logo.png" alt="LADINT Logo" className="w-8 h-8 object-contain" />
          <div>
            <p className="font-bold text-slate-800 text-sm">{t.defaultClubName}</p>
            <p className="text-xs text-slate-500">
              &copy; {new Date().getFullYear()} LADINT &bull; {t.footerRights}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500">
          <span>
            {t.contact} {contactEmail}
          </span>
          <span>Instagram: {instagram}</span>
          <Link
            href={locale === "en" ? "/en/admin" : "/admin"}
            className="text-cyan-600 hover:underline font-semibold"
          >
            {t.adminControl}
          </Link>
        </div>
      </div>
    </footer>
  );
}
