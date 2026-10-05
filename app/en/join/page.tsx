import type { Metadata } from "next";
import JoinPage from "@/components/join-page";

export const metadata: Metadata = {
  title: "Become a Member | LADINT",
};

export default function JoinRoute() {
  return <JoinPage locale="en" />;
}
