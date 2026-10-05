import type { Metadata } from "next";
import JoinPage from "@/components/join-page";

export const metadata: Metadata = {
  title: "Torne-se Membro | LADINT",
};

export default function IngressarRoute() {
  return <JoinPage locale="pt" />;
}
