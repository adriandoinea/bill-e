import { IIncome } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { DeleteIncome, EditIncome } from "./buttons";
import { fetchFilteredTransactions } from "@/lib/data";

interface IncomesTableProps {
  query: string;
  filterBy?: string;
  date?: string;
}

export default async function IncomesTable({
  query,
  date,
  filterBy,
}: IncomesTableProps) {
  const incomes = await fetchFilteredTransactions(
    query,
    {
      filterBy,
      date,
    },
    "income"
  );

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Note</TableHead>
          <TableHead>
            <span className="sr-only">Edit or Remove</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {incomes.map((income: IIncome) => (
          <TableRow key={income.id}>
            <TableCell>{income.category}</TableCell>
            <TableCell>{income.amount / 100}</TableCell>
            <TableCell>{dayjs(income.date).format("DD MMM YY")}</TableCell>
            <TableCell>{income.note}</TableCell>
            <TableCell className="flex gap-3 items-center justify-end">
              <EditIncome id={income.id} />
              <DeleteIncome id={income.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
