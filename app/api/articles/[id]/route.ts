import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, authors, journal, publication_date, abstract, doi_or_url, tags, pdf_url } = body;

    const tagsArray = Array.isArray(tags)
      ? tags
      : typeof tags === "string"
      ? tags.split(",").map((t: string) => t.trim()).filter(Boolean)
      : [];

    const updated = await sql`
      UPDATE scientific_articles
      SET 
        title = COALESCE(${title}, title),
        authors = COALESCE(${authors}, authors),
        journal = COALESCE(${journal}, journal),
        publication_date = COALESCE(${publication_date}, publication_date),
        abstract = COALESCE(${abstract}, abstract),
        doi_or_url = COALESCE(${doi_or_url}, doi_or_url),
        tags = ${tagsArray},
        pdf_url = COALESCE(${pdf_url}, pdf_url)
      WHERE id = ${Number(id)}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Artigo não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error("Error updating article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM scientific_articles WHERE id = ${Number(id)};`;
    return NextResponse.json({ success: true, message: "Artigo excluído com sucesso." });
  } catch (error: any) {
    console.error("Error deleting article:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
