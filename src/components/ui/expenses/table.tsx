import { IExpense } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { DeleteExpense, EditExpense } from "./buttons";
import { fetchFilteredExpenses } from "@/lib/data";

interface ExpensesTableProps {
  query: string;
  filterBy: "day" | "month" | "year" | string;
  date: string;
}

export default async function ExpensesTable({
  query,
  date,
  filterBy,
}: ExpensesTableProps) {
  const expenses = await fetchFilteredExpenses(query, {
    filterBy,
    date,
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/6">Category</TableHead>
          <TableHead className="w-1/6">Amount</TableHead>
          <TableHead className="w-1/6">Date</TableHead>
          <TableHead className="w-1/6">Note</TableHead>
          <TableHead className="w-1/6">Location</TableHead>
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
  );
}
