import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  adminCookieOptions,
  getAdminPassword,
  signAdminToken,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body.password === "string" ? body.password.trim() : "";

    if (!password) {
      return NextResponse.json(
        { success: false, error: "Senha obrigatória." },
        { status: 400 }
      );
    }

    if (password !== getAdminPassword().trim()) {
      return NextResponse.json(
        { success: false, error: "Senha incorreta." },
        { status: 401 }
      );
    }

    const token = await signAdminToken();
    const response = NextResponse.json({ success: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions());
    return response;
  } catch (error: any) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Falha na autenticação. Verifique as variáveis de ambiente." },
      { status: 500 }
    );
  }
}
