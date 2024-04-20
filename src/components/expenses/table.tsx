import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFilteredTransactions } from "@/lib/data/transactions";
import dayjs from "dayjs";
import { DeleteExpense, EditExpense } from "./buttons";

interface ExpensesTableProps {
  query: string;
  filterBy?: string;
  date?: string;
}

export default async function ExpensesTable({
  query,
  date,
  filterBy,
}: ExpensesTableProps) {
  const expenses = await fetchFilteredTransactions(
    query,
    {
      filterBy,
      date,
    },
    "expense"
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>Location</TableHead>
          <TableHead>
            <span className="sr-only">Edit or Remove</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {expenses.map((expense) => (
          <TableRow key={expense.id}>
            <TableCell>
              {expense.category.emoji} {expense.category.name}
            </TableCell>
            <TableCell>{expense.amount / 100}</TableCell>
            <TableCell>{dayjs(expense.date).format("DD MMM YY")}</TableCell>
            <TableCell>{expense.note}</TableCell>
            <TableCell>{expense.location}</TableCell>
            <TableCell className="flex gap-3 items-center justify-end">
              <EditExpense id={expense.id} />
              <DeleteExpense id={expense.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
