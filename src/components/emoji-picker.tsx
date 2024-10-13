import { cn } from "@/lib/utils";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { SmilePlus } from "lucide-react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";

interface Emoji {
  aliases: string[];
  id: string;
  keywords: string[];
  name: string;
  native: string;
  shortcodes: string;
  skin: number;
  unified: string;
}

interface Props {
  selectedValue?: string;
  onEmojiSelect: (data: Emoji) => void;
  hasError?: boolean;
  disabled?: boolean;
}

export default function EmojiPicker({
  selectedValue,
  disabled,
  onEmojiSelect,
  hasError,
}: Props) {
  const { resolvedTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const handleEmojiSelect = (data: Emoji) => {
    onEmojiSelect(data);
    setIsOpen(false);
  };
  const handleTogglePopover = () => setIsOpen(!isOpen);
  return (
    <Popover modal open={isOpen} onOpenChange={handleTogglePopover}>
      <PopoverTrigger
        disabled={disabled}
        title={
          disabled ? "Click on edit to enable Emoji picker" : "Emoji picker"
        }
        className={cn(
          "size-10 rounded-md text-xl flex items-center justify-center bg-transparent hover:bg-accent focus:bg-accent cursor-pointer",
          {
            "cursor-not-allowed": disabled,
            "hover:bg-transparent": disabled,
            "opacity-70": disabled,
            border: !disabled || hasError,
            "border-input": !disabled && !hasError,
            "border-destructive": hasError,
          }
        )}
      >
        {selectedValue || <SmilePlus size={20} />}
      </PopoverTrigger>
      <PopoverContent
        side="left"
        className="p-0 border-0 bg-transparent"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={handleEmojiSelect}
          maxFrequentRows={1}
          previewPosition="none"
          perLine={7}
        />
      </PopoverContent>
    </Popover>
  );
}
