import type { Metadata } from "next";
import ArticlesPage from "@/components/articles-page";

export const metadata: Metadata = {
  title: "Artigos Científicos | LADINT",
};

export default function ArtigosRoute() {
  return <ArticlesPage locale="pt" />;
}
