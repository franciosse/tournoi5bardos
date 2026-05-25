import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const playerSchema = z.object({
  name: z.string().min(2).max(80),
  number: z.number().int().min(1).max(99).optional(),
});

const inscriptionSchema = z.object({
  name: z.string().min(2).max(80),
  contactName: z.string().min(2).max(80),
  contactEmail: z.string().email(),
  contactPhone: z.string().max(20).optional(),
  players: z.array(playerSchema).min(1).max(10),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = inscriptionSchema.parse(body);

    const count = await prisma.team.count();
    if (count >= 8) {
      return NextResponse.json(
        { error: "Le tournoi est complet (8 équipes maximum)." },
        { status: 400 }
      );
    }

    const existing = await prisma.team.findUnique({ where: { name: data.name } });
    if (existing) {
      return NextResponse.json(
        { error: "Une équipe avec ce nom existe déjà." },
        { status: 400 }
      );
    }

    const team = await prisma.team.create({
      data: {
        name: data.name,
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        players: { create: data.players },
      },
      include: { players: true },
    });

    return NextResponse.json(team, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues[0].message }, { status: 422 });
    }
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}
