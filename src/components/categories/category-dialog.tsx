import { updateCategories } from "@/app/actions/categoriesActions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { validateCategoriesFields } from "@/lib/categories-utils";
import { cn } from "@/lib/utils";
import { ILocalCategory, ITransactionCategory } from "@/types";
import { Check, Pencil, Plus, Trash, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "../emoji-picker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "income" | "expense";
  categories: ITransactionCategory[];
}

export default function CategoryDialog({
  isOpen,
  onClose,
  type,
  categories,
}: Props) {
  const initCategoriesState: ILocalCategory[] = useMemo(
    () =>
      categories.map((category, index) => ({
        ...category,
        id: index,
        oldVal: category.name,
        newVal: category.name,
        emoji: category.emoji,
      })),
    [categories]
  );
  const [localCategories, setLocalCategories] =
    useState<ILocalCategory[]>(initCategoriesState);
  const prevCategoriesRef = useRef<ILocalCategory[]>([...initCategoriesState]);
  const categoryInputRef = useRef<HTMLInputElement | null>(null);

  const handleAddCategory = () => {
    const id =
      localCategories.length > 0
        ? localCategories[localCategories.length - 1].id + 1
        : 0;
    const newCategories = [
      ...localCategories,
      {
        id,
        oldVal: "",
        newVal: "",
        isEditing: true,
        isAdded: true,
        emoji: "",
        color: "",
      },
    ];
    setLocalCategories(newCategories);
    prevCategoriesRef.current = newCategories;
  };

  const handleRemoveCategory = (id: number) => {
    const newCategories = localCategories.map((category) => {
      if (category.id === id) {
        return { ...category, isDeletedLocally: true };
      }
      return category;
    });
    setLocalCategories(newCategories);
  };

  const handleCategoryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number
  ) => {
    const { value } = e.target;
    const newCategories = localCategories.map((category) => {
      if (category.id === id) {
        return {
          ...category,
          newVal: value,
          isUpdated: true,
          errors: { ...category.errors, newVal: null },
        };
      } else {
        return category;
      }
    });
    setLocalCategories(newCategories);
  };

  const handleEmojiSelect = (id: number, emoji: string) => {
    const newCategories = localCategories.map((category) => {
      if (category.id === id) {
        return {
          ...category,
          emoji,
          isUpdated: true,
          errors: { ...category.errors, emoji: null },
        };
      } else {
        return category;
      }
    });
    setLocalCategories(newCategories);
  };

  const handleColorSelection = (id: number, color?: string) => {
    if (!color) return;
    const newCategories = localCategories.map((category) => {
      if (category.id === id) {
        return {
          ...category,
          color,
          isUpdated: true,
        };
      } else {
        return category;
      }
    });
    setLocalCategories(newCategories);
  };

  const handleCancelEditing = (id: number) => {
    const newCategories = localCategories.map((category) => {
      if (category.id === id) {
        return { ...prevCategoriesRef.current[id], isEditing: false };
      }
      return category;
    });
    if (!prevCategoriesRef.current[id].newVal) {
      setLocalCategories(
        localCategories.filter((category) => category.id !== id)
      );
    } else setLocalCategories(newCategories);
  };

  const handleConfirmEditing = (id: number) => {
    if (!localCategories[id].newVal) {
      const newCategories = localCategories.filter((categ) => categ.id !== id);
      setLocalCategories(newCategories);
      prevCategoriesRef.current = newCategories;
    } else {
      prevCategoriesRef.current = localCategories;
      toggleEditingCategory(id, false);
    }
  };

  const handleSaveChanges = () => {
    const hasUnsavedFields = localCategories.some((categ) => categ.isEditing);
    const validatedFields = validateCategoriesFields(localCategories);
    if (!validatedFields.success) {
      const errorsArr = validatedFields.error.errors;
      const errors = errorsArr.reduce(
        (acc: Record<string | number, any>, current) => {
          const position = current.path[0];
          const fieldName = current.path[1];
          return {
            ...acc,
            [position]: {
              ...acc[position],
              [fieldName]: current.message,
            },
          };
        },
        {}
      );
      const newCategories = localCategories.map((category) => {
        if (errors[category.id]) {
          return { ...category, errors: errors[category.id] };
        }
        return category;
      });
      setLocalCategories(newCategories);
    } else if (
      !hasUnsavedFields ||
      confirm("Some categories are not confirmed. Do you want to save them?")
    ) {
      updateCategories(type, localCategories);
      onClose();
    }
  };

  const handleCancelChanges = () => {
    const hasUnsavedChanges = localCategories.some(
      (categ) =>
        categ.isEditing ||
        categ.isDeletedLocally ||
        categ.isAdded ||
        categ.isUpdated
    );
    if (
      !hasUnsavedChanges ||
      confirm(
        "Are you sure you want to cancel? All the unsaved changes will be lost."
      )
    ) {
      onClose();
    }
  };

  const toggleEditingCategory = (id: number, value: boolean) => {
    const newCategories = localCategories.map((category) => {
      if (category.id === id) {
        return { ...category, isEditing: value };
      } else {
        return category;
      }
    });
    setLocalCategories(newCategories);
  };

  const hasInputError = (category: ILocalCategory) => !!category.errors?.newVal;
  const hasEmojiError = (category: ILocalCategory) => !!category.errors?.emoji;

  useEffect(() => {
    categoryInputRef.current?.focus();
  }, [localCategories.length]);

  useEffect(() => {
    if (isOpen) {
      setLocalCategories(initCategoriesState);
      prevCategoriesRef.current = initCategoriesState;
    }
  }, [isOpen, initCategoriesState]);

  return (
    <Dialog modal open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="sm:max-w-[425px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit categories</DialogTitle>
          <DialogDescription>Edit categories for {type}s</DialogDescription>
        </DialogHeader>

        <form className="w-full" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-4 w-full">
            {localCategories.map(
              (category) =>
                !category.isDeletedLocally && (
                  <div
                    key={category.id}
                    className="w-full flex items-center gap-2"
                  >
                    <div className="flex items-center gap-1 w-full">
                      <EmojiPicker
                        selectedValue={category.emoji}
                        onEmojiSelect={(data) =>
                          handleEmojiSelect(category.id, data.native)
                        }
                        disabled={!category.isEditing}
                        hasError={hasEmojiError(category)}
                      />
                      <Input
                        type="color"
                        className="w-10 p-2"
                        disabled={!category.isEditing}
                        value={category.color}
                        onChange={(e) => {
                          handleColorSelection(category.id, e.target.value);
                        }}
                      />
                      <Input
                        className={cn(
                          "focus-visible:ring-0",
                          "focus-visible:border-primary",
                          {
                            "border-0": !category.isEditing,
                            "border-destructive": hasInputError(category),
                          }
                        )}
                        disabled={!category.isEditing}
                        ref={categoryInputRef}
                        value={
                          category.isEditing || category.newVal
                            ? category.newVal
                            : category.oldVal
                        }
                        onChange={(e) => handleCategoryChange(e, category.id)}
                      />
                    </div>
                    <div className="flex gap-1">
                      {category.isEditing ? (
                        <>
                          <Button
                            className="bg-transparent hover:bg-accent text-primary"
                            size="icon"
                            disabled={!category.newVal}
                            onClick={() => handleConfirmEditing(category.id)}
                          >
                            <Check size={17} />
                          </Button>
                          <Button
                            className="bg-transparent hover:bg-accent text-destructive"
                            size="icon"
                            onClick={() => handleCancelEditing(category.id)}
                          >
                            <X size={17} />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            className="bg-transparent hover:bg-accent text-primary"
                            size="icon"
                            onClick={() =>
                              toggleEditingCategory(category.id, true)
                            }
                          >
                            <Pencil size={17} />
                          </Button>
                          <Button
                            className="bg-transparent hover:bg-accent text-destructive"
                            size="icon"
                            onClick={() => handleRemoveCategory(category.id)}
                          >
                            <Trash size={17} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )
            )}
            <Button
              className="w-full bg-customAccent hover:bg-customAccent-foreground"
              size="icon"
              onClick={handleAddCategory}
            >
              <Plus />
            </Button>
          </div>

          <DialogFooter className="mt-8 flex justify-end gap-1">
            <Button
              className="bg-customAccent hover:bg-customAccent-foreground"
              onClick={handleCancelChanges}
            >
              Cancel
            </Button>
            <Button type="submit" onClick={handleSaveChanges}>
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
