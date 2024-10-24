import { auth } from "@/auth";
import prisma from "@/db";
import { fetchFilteredBudgets } from "@/lib/data/budgets";

export const DELETE = auth(async function DELETE(req) {
  if (!req.auth?.user?.id) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id: userId } = req.auth.user;
  const body: { id: string } = await req.json();

  try {
    const deletedExpense = await prisma.expense.delete({
      where: {
        id: body.id,
        userId,
      },
      select: {
        amount: true,
        category: {
          select: { color: true, emoji: true, name: true, type: true },
        },
        date: true,
        location: true,
        note: true,
      },
    });
    await fetchFilteredBudgets();
    return Response.json(deletedExpense, { status: 200 });
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "Failed to delete expense" },
      { status: 500 }
    );
  }
});
