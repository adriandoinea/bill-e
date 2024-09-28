import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreateBudget } from "./budgets/buttons";
import { Card } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import { cn } from "@/lib/utils";

function TransactionCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("p-4", className)}>
      <div className="flex justify-between items-center mb-2">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
      </div>
      <Skeleton className="h-4 w-1/4 mb-2" />
      <Skeleton className="h-4 w-3/4 mb-2" />
      <Skeleton className="h-4 w-2/3 mb-2" />
      <div className="flex justify-end gap-2 mt-2">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </Card>
  );
}

function TransactionsRowSkeleton({ type }: { type: "expense" | "income" }) {
  return (
    <TableRow>
      {type === "expense" ? (
        <TableCell>
          <Skeleton className="h-6" />
        </TableCell>
      ) : null}
      {[...Array(4)].map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-6" />
        </TableCell>
      ))}
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
    <>
      {[...Array(5)].map((_, index) => (
        <TransactionCardSkeleton key={index} className="md:hidden" />
      ))}

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
          {[...Array(8)].map((_, index) => (
            <TransactionsRowSkeleton key={index} type={type} />
          ))}
        </TableBody>
      </Table>
    </>
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

export function TransactionsTotalsSkeleton() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="h-[100px]">
        <Skeleton className="h-full" />
      </Card>
      <Card className="h-[100px]">
        <Skeleton className="h-full" />
      </Card>
      <Card className="h-[100px]">
        <Skeleton className="h-full" />
      </Card>
    </div>
  );
}

export function LineChartSkeleton() {
  return <Skeleton className="h-64 md:col-span-2" />;
}

export function DashboardPieChartSkeleton() {
  return <Skeleton className="size-64 rounded-full place-self-center" />;
}

export function DashboardBottomSectionSkeleton() {
  return <Skeleton className="h-60 w-full" />;
}
