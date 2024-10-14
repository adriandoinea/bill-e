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
import { FilterParams } from "@/types";
import TransactionCard from "../transaction-card";
import { CURRENCY } from "@/lib/constants";
import { roundWithTwoDecimals } from "@/lib/utils";
import { DeleteTransaction, EditTransaction } from "../transaction-buttons";

interface Props {
  query: string;
  filter: FilterParams;
}

export default async function IncomesTable({ query, filter }: Props) {
  const incomes = await fetchFilteredTransactions(query, filter, "income");

  return (
    <>
      {incomes?.map((income) => (
        <TransactionCard
          key={income.id}
          transaction={income}
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
            <TableHead>
              <span className="sr-only">Edit or Remove</span>
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {incomes?.map((income) => (
            <TableRow key={income.id}>
              <TableCell>
                {income.category.emoji} {income.category.name}
              </TableCell>
              <TableCell>
                {roundWithTwoDecimals(income.amount / 100)} {CURRENCY}
              </TableCell>
              <TableCell>{dayjs(income.date).format("DD MMM YY")}</TableCell>
              <TableCell>{income.note}</TableCell>
              <TableCell className="flex gap-3 items-center justify-end">
                <EditTransaction id={income.id} type="income" />
                <DeleteTransaction id={income.id} type="income" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}
