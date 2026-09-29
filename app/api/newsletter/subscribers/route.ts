import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const subscribers = await sql`
      SELECT id, email, name, is_active, created_at
      FROM newsletter_subscribers
      ORDER BY created_at DESC;
    `;
    return NextResponse.json({ success: true, data: subscribers });
  } catch (error: any) {
    console.error("Error fetching subscribers:", error);
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

    await sql`DELETE FROM newsletter_subscribers WHERE id = ${Number(id)};`;
    return NextResponse.json({ success: true, message: "Inscrito removido com sucesso." });
  } catch (error: any) {
    console.error("Error removing subscriber:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
