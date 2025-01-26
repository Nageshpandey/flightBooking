import { Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimeFilterProps {
  title: string
  location: string
  selected: string | null
  onChange: (value: string | null) => void
}

export function TimeFilter({ title, location, selected, onChange }: TimeFilterProps) {
  const timeRanges =
    location === "arrival"
      ? [
          { id: "early-morning", label: "Early morning", time: "(00:00 - 04:59)", icon: Sun },
          { id: "morning", label: "Morning", time: "(05:00 - 11:59)", icon: Sun },
          { id: "afternoon", label: "Afternoon", time: "(12:00 - 17:59)", icon: Sun },
          { id: "evening", label: "Evening", time: "(18:00 - 23:59)", icon: Moon },
        ]
      : [
          { id: "morning", label: "Morning", time: "(05:00 - 11:59)", icon: Sun },
          { id: "afternoon", label: "Afternoon", time: "(12:00 - 17:59)", icon: Sun },
          { id: "evening", label: "Evening", time: "(18:00 - 23:59)", icon: Moon },
        ]

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <div className="grid grid-cols-2 gap-3">
        {timeRanges.map((range) => {
          const Icon = range.icon
          return (
            <button
              key={range.id}
              onClick={() => onChange(selected === range.id ? null : range.id)}
              className={cn(
                "flex flex-col items-center justify-center p-4 rounded-lg border border-gray-200",
                "hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "transition-all duration-200",
                selected === range.id ? "bg-primary/5 border-primary" : "bg-white",
              )}
            >
              <Icon
                className={cn(
                  "w-5 h-5 mb-2",
                  range.id === "evening" ? "rotate-180" : "",
                  selected === range.id ? "text-primary" : "text-gray-600",
                )}
              />
              <div className="text-center">
                <div className="font-medium text-sm text-gray-900">{range.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{range.time}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

