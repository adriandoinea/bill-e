import { fetchFilteredExpenses } from "@/lib/data";
import dayjs from "dayjs";
import { IExpense } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteExpense, EditExpense } from "@/components/ui/expenses/buttons";
import ExpensesOperations from "@/components/ui/expenses/operations";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const query = searchParams.query || "";
  const filterBy = searchParams.filterBy || "month";
  const date = searchParams.date || dayjs().format("DD-MM-YYYY");

  const expenses = await fetchFilteredExpenses(query, {
    filterBy,
    date,
  });
  return (
    <div className="pl-10 pr-5 h-full flex flex-col gap-6">
      <div className="text-2xl mb-3">Expenses</div>
      <ExpensesOperations />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Note</TableHead>
            <TableHead>Location</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expenses.map((expense: IExpense) => (
            <TableRow key={expense.id}>
              <TableCell>{expense.category}</TableCell>
              <TableCell>{expense.amount / 100}</TableCell>
              <TableCell>{dayjs(expense.date).format("DD MMM YY")}</TableCell>
              <TableCell>{expense.note}</TableCell>
              <TableCell>{expense.location}</TableCell>
              <TableCell className="flex gap-3 items-center">
                <EditExpense id={expense.id} />
                <DeleteExpense id={expense.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
