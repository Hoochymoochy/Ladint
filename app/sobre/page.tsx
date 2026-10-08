import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "Sobre a LADINT | Liga Acadêmica de Direito Internacional – UNDB",
  description:
    "Um espaço para olhar o Direito além das fronteiras. Conheça a missão, os objetivos e as atividades da LADINT na UNDB.",
};

export default function SobreRoute() {
  return <AboutPage locale="pt" />;
}
