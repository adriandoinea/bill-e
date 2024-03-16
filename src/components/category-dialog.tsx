import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { createCategory } from "@/app/actions/categoriesActions";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  title: string;
  type: "income" | "expense";
  description?: string;
}

export default function CategoryDialog({
  isOpen,
  onClose,
  title,
  description,
  type,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form action={createCategory}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="name">Name</label>
              <Input name="name" id="name" placeholder="Category name" />
            </div>

            <div className="flex items-center gap-6">
              <label htmlFor="type">Type</label>
              <select
                className="w-full h-10 rounded-md bg-paper border-secondary border-[1px] pl-2 text-sm"
                name="type"
                id="type"
                placeholder="Category type"
                defaultValue={type}
              >
                <option value="" disabled>
                  Select a category type
                </option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="submit" onClick={onClose}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
