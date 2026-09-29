import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const newsletters = await sql`
      SELECT id, title, issue_number, summary, content, published_at, pdf_url, created_at
      FROM newsletters
      ORDER BY published_at DESC, id DESC;
    `;
    return NextResponse.json({ success: true, data: newsletters });
  } catch (error: any) {
    console.error("Error fetching newsletters:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, issue_number, summary, content, published_at, pdf_url } = body;

    if (!title || !issue_number || !summary) {
      return NextResponse.json(
        { success: false, error: "Título, número da edição e resumo são obrigatórios." },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO newsletters (title, issue_number, summary, content, published_at, pdf_url)
      VALUES (
        ${title},
        ${issue_number},
        ${summary},
        ${content || ""},
        ${published_at || new Date().toISOString().split("T")[0]},
        ${pdf_url || ""}
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error("Error creating newsletter:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
