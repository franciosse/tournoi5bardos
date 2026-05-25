import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAdminSession, clearAdminSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const ok = await verifyAdminPassword(password);
  if (!ok) {
    return NextResponse.json({ error: "Mot de passe incorrect." }, { status: 401 });
  }
  await setAdminSession();
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}
