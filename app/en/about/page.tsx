import type { Metadata } from "next";
import AboutPage from "@/components/about-page";

export const metadata: Metadata = {
  title: "About LADINT | Academic League of International Law – UNDB",
  description:
    "A space to look at Law beyond borders. Learn about LADINT’s mission, goals, and activities at UNDB.",
};

export default function AboutRoute() {
  return <AboutPage locale="en" />;
}
