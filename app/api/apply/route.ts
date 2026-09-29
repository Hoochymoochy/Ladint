import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, course_semester, motivation } = body;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Nome e e-mail são obrigatórios." }, { status: 400 });
    }

    const inserted = await sql`
      INSERT INTO member_applications (name, email, phone, course_semester, motivation)
      VALUES (${name}, ${email}, ${phone || ""}, ${course_semester || ""}, ${motivation || ""})
      RETURNING *;
    `;

    return NextResponse.json({
      success: true,
      message: "Candidatura enviada com sucesso! Entraremos em contato em breve.",
      data: inserted[0],
    });
  } catch (error: any) {
    console.error("Error submitting member application:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const applications = await sql`
      SELECT id, name, email, phone, course_semester, motivation, created_at
      FROM member_applications
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({ success: true, data: applications });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "ID é obrigatório" }, { status: 400 });
    }
    await sql`DELETE FROM member_applications WHERE id = ${Number(id)};`;
    return NextResponse.json({ success: true, message: "Candidatura removida." });
  } catch (error: any) {
    console.error("Error deleting application:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
