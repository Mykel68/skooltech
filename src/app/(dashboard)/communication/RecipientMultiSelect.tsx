import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown } from "lucide-react";

export function RecipientMultiSelect({
  label,
  options,
  selected,
  onToggle,
}: any) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          <span className="truncate">{label}</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2 space-y-1">
        {options.map((opt: string) => (
          <label
            key={opt}
            className="flex items-center gap-2 px-2 py-1 rounded hover:bg-muted cursor-pointer"
          >
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => onToggle(opt)}
            />
            <span className="text-sm">{opt}</span>
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}
