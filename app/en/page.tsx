import type { Metadata } from "next";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Academic League of International Law",
};

export default function EnglishHomePage() {
  return <LandingPage locale="en" />;
}
