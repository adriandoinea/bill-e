import { ITransactionCategory } from "@/types";
import { List, Pen, Plus } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import CategoryDialog from "./category-dialog";

interface Props {
  categories: ITransactionCategory[];
  type: "expense" | "income";
  defaultValue?: string;
}
export default function CategorySelector({
  categories,
  type,
  defaultValue,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState(defaultValue || "");
  const handleSelectChange = (value: string) => {
    setSelectedCategory(value);
  };
  const handleCloseDialog = () => setSelectedCategory("");
  const isDialogOpen = selectedCategory === "new";
  return (
    <>
      <Select
        value={selectedCategory !== "new" ? selectedCategory : ""}
        onValueChange={handleSelectChange}
        name="category"
      >
        <SelectTrigger className="w-full">
          <div className="flex items-center gap-2">
            <List className="pointer-events-none h-[18px] w-[18px] text-gray-500" />
            <SelectValue placeholder="Select a category" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            className="cursor-pointer flex items-center justify-center p-4"
            value="new"
          >
            <div className="flex items-center gap-1">
              {categories.length ? (
                <>
                  <Pen size={17} />
                  <>Edit Categories</>
                </>
              ) : (
                <>
                  <Plus size={20} />
                  <span>Add Category</span>
                </>
              )}
            </div>
          </SelectItem>
          {categories.map((category) => (
            <SelectItem key={category.name} value={category.name}>
              {category.emoji} {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <CategoryDialog
        type={type}
        isOpen={isDialogOpen}
        categories={categories}
        onClose={handleCloseDialog}
      />
    </>
  );
}
