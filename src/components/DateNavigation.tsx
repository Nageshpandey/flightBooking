import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface DateNavigationProps {
  dates: Date[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  prices: { [key: string]: number }
}

export function DateNavigation({ dates, selectedDate, onDateSelect, prices }: DateNavigationProps) {
  return (
    <div className="flex items-stretch gap-2 overflow-x-auto scrollbar-hide py-2">
      {dates.map((date, i) => {
        const isSelected = date.toDateString() === selectedDate.toDateString()
        const dateKey = format(date, "yyyy-MM-dd")
        const price = prices[dateKey] || 4770

        return (
          <Button
            key={i}
            onClick={() => onDateSelect(date)}
            variant="outline"
            className={cn(
              "min-w-[120px] h-auto py-2 px-4 flex flex-col items-center gap-1 rounded-lg transition-all",
              "border hover:bg-gray-50",
              isSelected && "bg-[#15171a] text-white hover:bg-[#15171a] border-[#15171a]",
            )}
          >
            <span className="text-sm font-medium">
              {format(date, "EEE")}, {format(date, "d MMM")}
            </span>
            <span className={cn("text-sm font-bold", isSelected ? "text-white" : "text-emerald-600")}>
              ₹{price.toLocaleString("en-IN")}
            </span>
          </Button>
        )
      })}
    </div>
  )
}

