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
  const createCategoryForType = createCategory.bind(null, type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <form action={createCategoryForType}>
          <div className="flex items-center gap-4">
            <label htmlFor="name">Name</label>
            <Input name="name" id="name" placeholder="Category name" />
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
