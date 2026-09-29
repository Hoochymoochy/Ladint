import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET() {
  try {
    const events = await sql`
      SELECT id, title, event_name, location, event_date, description, achievements, image_url, created_at
      FROM big_events
      ORDER BY event_date DESC, id DESC;
    `;
    return NextResponse.json({ success: true, data: events });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, event_name, location, event_date, description, achievements, image_url } = body;

    if (!title || !event_name || !location || !event_date || !description) {
      return NextResponse.json(
        { success: false, error: "Título, nome do evento, local, data e descrição são obrigatórios." },
        { status: 400 }
      );
    }

    const inserted = await sql`
      INSERT INTO big_events (title, event_name, location, event_date, description, achievements, image_url)
      VALUES (
        ${title},
        ${event_name},
        ${location},
        ${event_date},
        ${description},
        ${achievements || ""},
        ${image_url || ""}
      )
      RETURNING *;
    `;

    return NextResponse.json({ success: true, data: inserted[0] });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
