import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";
import { CreateBudget } from "./ui/budgets/buttons";

function TransactionsRowSkeleton({ type }: { type: "expense" | "income" }) {
  return (
    <TableRow>
      {type === "expense" ? (
        <TableCell>
          <Skeleton className="h-6" />
        </TableCell>
      ) : null}
      <TableCell>
        <Skeleton className="h-6" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6" />
      </TableCell>
      <TableCell className="flex justify-end">
        <Skeleton className="h-6 w-16" />
      </TableCell>
    </TableRow>
  );
}

export function TransactionsTableSkeleton({
  type,
}: {
  type: "expense" | "income";
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Category</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Note</TableHead>
          {type === "expense" ? <TableHead>Location</TableHead> : null}
          <TableHead>
            <span className="sr-only">Edit or Remove</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
        <TransactionsRowSkeleton type={type} />
      </TableBody>
    </Table>
  );
}

export function BudgetsDashboardSkeleton() {
  return (
    <>
      <div className="flex items-center gap-8 w-full">
        <Skeleton className="w-64 h-52 rounded-full" />
        <Skeleton className="w-full h-52" />
      </div>

      <div className="flex flex-wrap gap-5">
        <CreateBudget />
        <Skeleton className="w-56 h-40" />
        <Skeleton className="w-56 h-40" />
        <Skeleton className="w-56 h-40" />
      </div>
    </>
  );
}
