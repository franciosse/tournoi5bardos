import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  try {
    const { id } = await params;
    const { score1, score2 } = await req.json();
    const match = await prisma.match.update({
      where: { id: parseInt(id) },
      data: {
        score1: parseInt(score1),
        score2: parseInt(score2),
        status: "played",
      },
    });
    return NextResponse.json(match);
  } catch {
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
