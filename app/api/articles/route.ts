import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const articles = await sql`
      SELECT id, title, authors, journal, publication_date, abstract, doi_or_url, tags, created_at
      FROM scientific_articles
      ORDER BY publication_date DESC, id DESC;
    `;
    return NextResponse.json({ success: true, data: articles });
  } catch (error: any) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, authors, journal, publication_date, abstract, doi_or_url, tags } = body;

    if (!title || !authors || !journal || !publication_date || !abstract) {
      return NextResponse.json(
        { success: false, error: "Título, autores, periódico, data e resumo são obrigatórios." },
        { status: 400 }
      );
    }

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const inserted = await sql`
      INSERT INTO scientific_articles (title, authors, journal, publication_date, abstract, doi_or_url, tags)
      VALUES (
        ${title},
        ${authors},
        ${journal},
        ${publication_date},
        ${abstract},
        ${doi_or_url || ""},
        ${tagsArray}
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
