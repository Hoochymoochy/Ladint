import type { Metadata } from "next";
import ArticlesPage from "@/components/articles-page";

export const metadata: Metadata = {
  title: "Scientific Articles | LADINT",
};

export default function ArticlesRoute() {
  return <ArticlesPage locale="en" />;
}
