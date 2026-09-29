import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (key) {
      const res = await sql`SELECT key, value, updated_at FROM site_settings WHERE key = ${key};`;
      if (res.length === 0) {
        return NextResponse.json({ success: true, data: null });
      }
      return NextResponse.json({ success: true, data: res[0].value });
    }

    const all = await sql`SELECT key, value, updated_at FROM site_settings;`;
    const settingsMap: Record<string, any> = {};
    for (const item of all) {
      settingsMap[item.key] = item.value;
    }
    return NextResponse.json({ success: true, data: settingsMap });
  } catch (error: any) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "Chave (key) e valor (value) são obrigatórios." }, { status: 400 });
    }

    const result = await sql`
      INSERT INTO site_settings (key, value, updated_at)
      VALUES (${key}, ${JSON.stringify(value)}, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING key, value, updated_at;
    `;

    return NextResponse.json({ success: true, data: result[0] });
  } catch (error: any) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
