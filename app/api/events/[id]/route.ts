import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, event_name, location, event_date, description, achievements, image_url } = body;

    const updated = await sql`
      UPDATE big_events
      SET 
        title = COALESCE(${title}, title),
        event_name = COALESCE(${event_name}, event_name),
        location = COALESCE(${location}, location),
        event_date = COALESCE(${event_date}, event_date),
        description = COALESCE(${description}, description),
        achievements = COALESCE(${achievements}, achievements),
        image_url = COALESCE(${image_url}, image_url)
      WHERE id = ${Number(id)}
      RETURNING *;
    `;

    if (updated.length === 0) {
      return NextResponse.json({ success: false, error: "Evento não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (error: any) {
    console.error("Error updating event:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM big_events WHERE id = ${Number(id)};`;
    return NextResponse.json({ success: true, message: "Evento excluído com sucesso." });
  } catch (error: any) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
