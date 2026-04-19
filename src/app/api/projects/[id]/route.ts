import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET single project with all relations
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id, userId: session.user.id },
    include: {
      products: { include: { ingredients: true } },
      capitalItems: true,
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT replace full project data (including products & capital items)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  // Validate ownership first
  const existing = await prisma.project.findUnique({ where: { id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });
  }

  // Transaction: update project scalar fields, then replace products & capitalItems
  const result = await prisma.$transaction(async (tx: any) => {
    // Update scalar fields
    await tx.project.update({
      where: { id },
      data: {
        businessName: body.businessName,
        industryCategory: body.industryCategory,
        bepMonthlyOps: body.bepMonthlyOps,
        bepTargetDays: body.bepTargetDays,
      },
    });

    // --- Sync Products ---
    // Delete old products (cascade deletes ingredients)
    await tx.product.deleteMany({ where: { projectId: id } });
    // Create new products with ingredients
    if (body.products && body.products.length > 0) {
      for (const prod of body.products) {
        await tx.product.create({
          data: {
            id: prod.id,
            name: prod.name,
            category: prod.category,
            targetMargin: prod.targetMargin,
            packaging: prod.packaging,
            labor: prod.labor,
            overhead: prod.overhead,
            projectId: id,
            ingredients: {
              create: (prod.ingredients || []).map((ing: any) => ({
                id: ing.id,
                name: ing.name,
                qty: ing.qty,
                unit: ing.unit,
                unitCost: ing.unitCost,
              })),
            },
          },
        });
      }
    }

    // --- Sync Capital Items ---
    await tx.capitalItem.deleteMany({ where: { projectId: id } });
    if (body.capitalItems && body.capitalItems.length > 0) {
      await tx.capitalItem.createMany({
        data: body.capitalItems.map((item: any) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          cost: item.cost,
          projectId: id,
        })),
      });
    }

    // Re-fetch and return the full project
    return tx.project.findUnique({
      where: { id },
      include: {
        products: { include: { ingredients: true } },
        capitalItems: true,
      },
    });
  });

  return NextResponse.json(result);
}

// DELETE project
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  
  // Try to find the exact project for this user
  const existing = await prisma.project.findUnique({ where: { id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
