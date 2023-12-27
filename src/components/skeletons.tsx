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
