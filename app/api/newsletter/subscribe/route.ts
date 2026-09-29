import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Por favor, insira um endereço de e-mail válido." },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name ? name.trim() : null;

    const existing = await sql`
      SELECT id, is_active FROM newsletter_subscribers WHERE LOWER(email) = ${trimmedEmail};
    `;

    if (existing.length > 0) {
      if (!existing[0].is_active) {
        await sql`
          UPDATE newsletter_subscribers 
          SET is_active = TRUE, name = COALESCE(${trimmedName}, name)
          WHERE id = ${existing[0].id};
        `;
        return NextResponse.json({
          success: true,
          message: "Sua inscrição na newsletter foi reativada com sucesso!",
        });
      }
      return NextResponse.json({
        success: true,
        message: "Você já está inscrito em nossa newsletter! Obrigado pelo interesse.",
      });
    }

    const inserted = await sql`
      INSERT INTO newsletter_subscribers (email, name)
      VALUES (${trimmedEmail}, ${trimmedName})
      RETURNING id, email, name, created_at;
    `;

    return NextResponse.json({
      success: true,
      message: "Inscrição realizada com sucesso! Você receberá as próximas edições da LADINT.",
      data: inserted[0],
    });
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
