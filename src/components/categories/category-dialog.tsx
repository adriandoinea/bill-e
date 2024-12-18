"use client";

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
import { Check, Loader2, Pencil, Plus, Trash, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import EmojiPicker from "../emoji-picker";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
interface Props {
  isOpen: boolean;
  onClose: Function;
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
  const [isLoading, setIsLoading] = useState(false);
  const prevCategoriesRef = useRef<ILocalCategory[]>([...initCategoriesState]);
  const categoryInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  const hasUnsavedChanges = localCategories.some(
    (categ) =>
      categ.isEditing ||
      categ.isDeletedLocally ||
      categ.isAdded ||
      categ.isUpdated
  );

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

  const handleSaveChanges = async () => {
    if (!hasUnsavedChanges) {
      onClose();
      return;
    }

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
      const addedCategories = localCategories.filter((categ) => categ.isAdded);
      const updatedCategories = localCategories.filter(
        (category) =>
          category.isUpdated && !category.isDeletedLocally && !category.isAdded
      );
      const deletedCategories = localCategories.filter(
        (categ) => categ.isDeletedLocally
      );

      try {
        setIsLoading(true);

        if (addedCategories.length > 0) {
          await fetch("/api/categories/add", {
            method: "POST",
            body: JSON.stringify({ type, categories: addedCategories }),
          });
          toast("Categories added successfully!");
        }

        if (updatedCategories.length > 0) {
          await fetch("/api/categories/update", {
            method: "PUT",
            body: JSON.stringify({ type, categories: updatedCategories }),
          });
          toast("Categories updated successfully!");
        }

        if (deletedCategories.length > 0) {
          await fetch("/api/categories/delete", {
            method: "DELETE",
            body: JSON.stringify({ type, categories: deletedCategories }),
          });
          toast("Categories deleted successfully!");
        }

        router.refresh();
        onClose();
      } catch (e) {
        console.error(e);
        if (e && typeof e === "object") {
          if ("message" in e) toast.error(e.message as string);
          else toast.error("Something went wrong!");
        }
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleCancelChanges = () => {
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
    <Dialog modal open={isOpen} onOpenChange={handleCancelChanges}>
      <DialogContent
        className="sm:max-w-[425px] max-h-[80vh] flex flex-col"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Edit categories</DialogTitle>
          <DialogDescription>Edit categories for {type}s</DialogDescription>
        </DialogHeader>

        <form
          className="w-full flex-grow overflow-hidden flex flex-col"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="flex flex-col flex-grow gap-4 pr-2 overflow-y-auto w-full">
            {isLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-customAccent" />
              </div>
            )}
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
                            "border-0":
                              !category.isEditing && !hasInputError(category),
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
                    <div className="flex gap-1 shrink-0">
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
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <Button
              variant="secondary"
              className="w-full"
              onClick={handleAddCategory}
            >
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>

            <DialogFooter className="flex justify-end gap-1 px-0">
              <Button
                variant="outline"
                onClick={handleCancelChanges}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                variant="custom"
                type="submit"
                onClick={handleSaveChanges}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
