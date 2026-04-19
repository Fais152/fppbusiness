import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET all projects for the authenticated user
export async function GET() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    include: {
      products: {
        include: { ingredients: true },
      },
      capitalItems: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(projects);
}

// POST create new project
export async function POST(req: NextRequest) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const project = await prisma.project.create({
    data: {
      userId: session.user.id,
      businessName: body.businessName || "Proyek Baru",
      industryCategory: body.industryCategory || "F&B",
      bepMonthlyOps: body.bepMonthlyOps ?? 500000,
      bepTargetDays: body.bepTargetDays ?? 30,
    },
    include: {
      products: { include: { ingredients: true } },
      capitalItems: true,
    },
  });

  return NextResponse.json(project, { status: 201 });
}
