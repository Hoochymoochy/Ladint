import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM newsletters WHERE id = ${Number(id)};`;
    return NextResponse.json({ success: true, message: "Newsletter excluída com sucesso." });
  } catch (error: any) {
    console.error("Error deleting newsletter:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
