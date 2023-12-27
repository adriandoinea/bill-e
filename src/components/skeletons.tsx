import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "./ui/skeleton";

function TransactionsRowSkeleton() {
  return (
    <TableRow>
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
      <TableCell>
        <Skeleton className="h-6" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-16" />
      </TableCell>
    </TableRow>
  );
}

export function TransactionsTableSkeleton() {
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
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
        <TransactionsRowSkeleton />
      </TableBody>
    </Table>
  );
}
