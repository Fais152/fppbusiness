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
      transactions: { orderBy: { date: "desc" } },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(project);
}

// PUT replace full project data (including products, capital items, and transactions)
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

  // Transaction: update project scalar fields, then replace products & capitalItems & transactions
  const result = await prisma.$transaction(async (tx) => {
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
    await tx.product.deleteMany({ where: { projectId: id } });
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
              create: (prod.ingredients || []).map((ing: { id?: string; name: string; qty?: number; unit?: string; unitCost?: number }) => ({
                id: ing.id,
                name: ing.name,
                qty: Number(ing.qty) || 0,
                unit: ing.unit || "gr",
                unitCost: Number(ing.unitCost) || 0,
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
        data: body.capitalItems.map((item: { id?: string; name: string; category?: string; cost?: number }) => ({
          id: item.id,
          name: item.name,
          category: item.category,
          cost: Number(item.cost) || 0,
          projectId: id,
        })),
      });
    }

    // --- Sync Transactions ---
    await tx.dailyTransaction.deleteMany({ where: { projectId: id } });
    if (body.transactions && body.transactions.length > 0) {
      await tx.dailyTransaction.createMany({
        data: body.transactions.map((t: { id?: string; date?: string; type?: string; amount?: number; category?: string; description?: string }) => ({
          id: t.id,
          date: t.date ? new Date(t.date) : new Date(),
          type: t.type || "IN",
          amount: Number(t.amount) || 0,
          category: t.category || "Penjualan",
          description: t.description || null,
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
        transactions: { orderBy: { date: "desc" } },
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
  
  const existing = await prisma.project.findUnique({ where: { id, userId: session.user.id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found or unauthorized" }, { status: 403 });
  }

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
