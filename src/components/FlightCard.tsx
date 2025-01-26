import { Card } from "@/components/ui/card"
import { Clock, Plane } from "lucide-react"
import type { FlightOffer } from "../types"

type FlightCardProps = {
  flight: FlightOffer
  carriers: { [key: string]: string }
  isReturn?: boolean
  onClick: () => void // Add onClick prop
}

export const FlightCard = ({ flight, carriers, isReturn = false, onClick }: FlightCardProps) => {
  const { itineraries, price, validatingAirlineCodes } = flight

  const formatTime = (time: string) => {
    const date = new Date(time)
    return date.toLocaleString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatDate = (time: string) => {
    const date = new Date(time)
    return date.toLocaleString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    })
  }

  const formatPriceToINR = (amount: number, currency: string) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN")}`
    }

    const conversionRates: { [key: string]: number } = {
      USD: 83.0,
      EUR: 90.0,
      GBP: 103.0,
    }

    const convertedAmount = conversionRates[currency] ? amount * conversionRates[currency] : amount

    return `₹${Math.round(convertedAmount).toLocaleString("en-IN")}`
  }

  const formattedPrice = formatPriceToINR(Number.parseFloat(price.total.toString()), price.currency)
  const departureSegment = itineraries[0].segments[0]
  const arrivalSegment = itineraries[0].segments.slice(-1)[0]

  // Calculate total duration in minutes
  const totalDuration = (() => {
    const departure = new Date(departureSegment.departure.at)
    const arrival = new Date(arrivalSegment.arrival.at)
    return Math.round((arrival.getTime() - departure.getTime()) / (1000 * 60))
  })()

  // Format duration
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={onClick}>
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-6 flex-1">
          {/* Airline Info */}
          <div className="flex flex-col items-center gap-2 min-w-[100px]">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Plane className="w-6 h-6 text-gray-600" />
            </div>
            <div className="text-sm font-medium text-center">
              {validatingAirlineCodes.map((code) => carriers[code] || code).join(", ")}
            </div>
          </div>

          {/* Flight Details */}
          <div className="flex-1 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Departure */}
            <div>
              <div className="text-2xl font-bold">{formatTime(departureSegment.departure.at)}</div>
              <div className="text-sm text-gray-600">{departureSegment.departure.iataCode}</div>
              <div className="text-sm text-gray-500">{formatDate(departureSegment.departure.at)}</div>
            </div>

            {/* Duration & Stops */}
            <div className="flex flex-col items-center gap-2">
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDuration(totalDuration)}
              </div>
              <div className="w-32 h-[2px] bg-gray-300 relative">
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 border-gray-300 bg-white"></div>
              </div>
              <div className="text-xs text-gray-500">
                {itineraries[0].segments.length > 1
                  ? `${itineraries[0].segments.length - 1} stop${itineraries[0].segments.length > 2 ? "s" : ""}`
                  : "Direct"}
              </div>
            </div>

            {/* Arrival */}
            <div className="text-right">
              <div className="text-2xl font-bold">{formatTime(arrivalSegment.arrival.at)}</div>
              <div className="text-sm text-gray-600">{arrivalSegment.arrival.iataCode}</div>
              <div className="text-sm text-gray-500">{formatDate(arrivalSegment.arrival.at)}</div>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex flex-col items-end gap-1">
          <div className="text-2xl font-bold text-blue-600">{formattedPrice}</div>
          <div className="text-sm text-gray-500">per traveller</div>
        </div>
      </div>
    </Card>
  )
}