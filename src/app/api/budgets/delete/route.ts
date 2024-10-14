import { auth } from "@/auth";
import prisma from "@/db";

export const DELETE = auth(async function DELETE(req) {
  if (!req.auth?.user?.id) {
    return Response.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { id: userId } = req.auth.user;
  const body: { id: string } = await req.json();

  const deletedBudget = await prisma.budget.delete({
    where: {
      id: body.id,
      userId,
    },
    select: {
      resetPeriod: true,
      category: {
        select: { color: true, emoji: true, name: true, type: true },
      },
    },
  });

  return Response.json(deletedBudget, { status: 200 });
});
