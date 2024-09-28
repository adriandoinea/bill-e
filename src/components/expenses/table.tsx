import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchFilteredTransactions } from "@/lib/data/transactions";
import { FilterParams } from "@/types";
import dayjs from "dayjs";
import { DeleteExpense, EditExpense } from "./buttons";
import TransactionCard from "../transaction-card";

interface Props {
  query: string;
  filter: FilterParams;
}

export default async function ExpensesTable({ query, filter }: Props) {
  const expenses = await fetchFilteredTransactions(query, filter, "expense");

  return (
    <>
      {expenses?.map((expense) => (
        <TransactionCard
          key={expense.id}
          transaction={expense}
          className="md:hidden"
        />
      ))}

      <Table className="hidden md:table text-base">
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
          {expenses?.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell>
                {expense.category.emoji} {expense.category.name}
              </TableCell>
              <TableCell>${(expense.amount / 100).toFixed(2)}</TableCell>
              <TableCell>{dayjs(expense.date).format("DD MMM YY")}</TableCell>
              <TableCell>{expense.note}</TableCell>
              {"location" in expense && (
                <TableCell>{expense.location as string}</TableCell>
              )}
              <TableCell className="flex gap-3 items-center justify-end">
                <EditExpense id={expense.id} />
                <DeleteExpense id={expense.id} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
