import { Suspense } from "react";
import AdminLoginPage from "@/components/admin-login-page";

export default function EnAdminLoginRoute() {
  return (
    <Suspense fallback={null}>
      <AdminLoginPage locale="en" />
    </Suspense>
  );
}
