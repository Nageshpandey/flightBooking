import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { format, addDays, subDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ArrowDownUp, ArrowUpDown, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import { FlightCard } from "../components/FlightCard"
import { fetchFlights } from "../lib/api"
import type { FlightOffer } from "../types"
import { cn } from "@/lib/utils"
import { TimeFilter } from "../components/time-filter"

const FlightListPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = location.state?.searchParams
  const [flights, setFlights] = useState<FlightOffer[]>([])
  const [carriers, setCarriers] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    stops: null as string | null,
    airline: null as string | null,
    baggage: null as boolean | null,
    departureTime: null as string | null,
    arrivalTime: null as string | null,
    priceRange: [0, 100000] as [number, number],
  })
  const [sortOption, setSortOption] = useState<
    | "RECOMMENDED"
    | "PRICE_LOW_TO_HIGH"
    | "PRICE_HIGH_TO_LOW"
    | "DURATION_SHORT_TO_LONG"
    | "DURATION_LONG_TO_SHORT"
    | "DEPARTURE_EARLIEST"
    | "DEPARTURE_LATEST"
    | "ARRIVAL_EARLIEST"
    | "ARRIVAL_LATEST"
  >("RECOMMENDED")
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(searchParams.departureDate))
  const [dateRange, setDateRange] = useState<Date[]>([])
  const [currentPage, setCurrentPage] = useState(0)

  // New state for departure and arrival locations
  const [departureLocation, setDepartureLocation] = useState({ code: "", city: "" })
  const [arrivalLocation, setArrivalLocation] = useState({ code: "", city: "" })

  useEffect(() => {
    const range = []
    for (let i = -3; i <= 3; i++) {
      range.push(addDays(selectedDate, i))
    }
    setDateRange(range)
  }, [selectedDate])

  const filterFlights = (flight: FlightOffer) => {
    const segment = flight.itineraries[0].segments[0]
    const lastSegment = flight.itineraries[0].segments.slice(-1)[0]
    const departureHour = new Date(segment.departure.at).getHours()
    const arrivalHour = new Date(lastSegment.arrival.at).getHours()

    const isValidDepartureTime =
      !filters.departureTime ||
      (filters.departureTime === "morning" && departureHour >= 5 && departureHour < 12) ||
      (filters.departureTime === "afternoon" && departureHour >= 12 && departureHour < 18) ||
      (filters.departureTime === "evening" && departureHour >= 18 && departureHour < 24)

    const isValidArrivalTime =
      !filters.arrivalTime ||
      (filters.arrivalTime === "early-morning" && arrivalHour >= 0 && arrivalHour < 5) ||
      (filters.arrivalTime === "morning" && arrivalHour >= 5 && arrivalHour < 12) ||
      (filters.arrivalTime === "afternoon" && arrivalHour >= 12 && arrivalHour < 18) ||
      (filters.arrivalTime === "evening" && arrivalHour >= 18 && arrivalHour < 24)

    return (
      (!filters.stops || filters.stops === (flight.itineraries[0].segments.length - 1).toString()) &&
      (!filters.airline || flight.validatingAirlineCodes.includes(filters.airline)) &&
      (!filters.baggage ||
        flight.travelerPricings.some((tp) =>
          tp.fareDetailsBySegment.some((fd) => fd.includedCheckedBags && fd.includedCheckedBags.quantity > 0),
        )) &&
      isValidDepartureTime &&
      isValidArrivalTime
    )
  }

  const filteredFlights = useMemo(() => flights.filter(filterFlights), [flights, filters, filterFlights])

  const calculateDuration = (itinerary: { segments: { departure: { at: string }; arrival: { at: string } }[] }) => {
    const departureTime = new Date(itinerary.segments[0].departure.at).getTime()
    const arrivalTime = new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at).getTime()
    return (arrivalTime - departureTime) / (1000 * 60)
  }

  const sortedFlights = useMemo(() => {
    const sorted = [...filteredFlights]
    switch (sortOption) {
      case "PRICE_LOW_TO_HIGH":
        return sorted.sort((a, b) => Number.parseFloat(a.price.total) - Number.parseFloat(b.price.total))
      case "PRICE_HIGH_TO_LOW":
        return sorted.sort((a, b) => Number.parseFloat(b.price.total) - Number.parseFloat(a.price.total))
      case "DURATION_SHORT_TO_LONG":
        return sorted.sort((a, b) => calculateDuration(a.itineraries[0]) - calculateDuration(b.itineraries[0]))
      case "DURATION_LONG_TO_SHORT":
        return sorted.sort((a, b) => calculateDuration(b.itineraries[0]) - calculateDuration(a.itineraries[0]))
      case "DEPARTURE_EARLIEST":
        return sorted.sort(
          (a, b) =>
            new Date(a.itineraries[0].segments[0].departure.at).getTime() -
            new Date(b.itineraries[0].segments[0].departure.at).getTime(),
        )
      case "DEPARTURE_LATEST":
        return sorted.sort(
          (a, b) =>
            new Date(b.itineraries[0].segments[0].departure.at).getTime() -
            new Date(a.itineraries[0].segments[0].departure.at).getTime(),
        )
      case "ARRIVAL_EARLIEST":
        return sorted.sort((a, b) => {
          const aLastSegment = a.itineraries[0].segments[a.itineraries[0].segments.length - 1]
          const bLastSegment = b.itineraries[0].segments[b.itineraries[0].segments.length - 1]
          return new Date(aLastSegment.arrival.at).getTime() - new Date(bLastSegment.arrival.at).getTime()
        })
      case "ARRIVAL_LATEST":
        return sorted.sort((a, b) => {
          const aLastSegment = a.itineraries[0].segments[a.itineraries[0].segments.length - 1]
          const bLastSegment = b.itineraries[0].segments[b.itineraries[0].segments.length - 1]
          return new Date(bLastSegment.arrival.at).getTime() - new Date(aLastSegment.arrival.at).getTime()
        })
      case "RECOMMENDED":
      default:
        return sorted
    }
  }, [filteredFlights, sortOption])

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const handleDateChange = (date: Date) => {
    setSelectedDate(date)
  }

  const handleFlightSelect = (flight: FlightOffer) => {
    navigate("/review-trip", { state: { flight } })
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = direction === "prev" ? subDays(selectedDate, 1) : addDays(selectedDate, 1)
    setSelectedDate(newDate)
  }

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const res = await fetchFlights({
          ...searchParams,
          departureDate: format(selectedDate, "yyyy-MM-dd"),
        })
        if (res && res.offers) {
          setFlights(res.offers)
          setCarriers(res.carriers || {})

          // Set departure and arrival locations based on the first flight
          if (res.offers.length > 0) {
            const firstFlight = res.offers[0]
            const firstSegment = firstFlight.itineraries[0].segments[0]
            const lastSegment = firstFlight.itineraries[0].segments[firstFlight.itineraries[0].segments.length - 1]

            setDepartureLocation({
              code: firstSegment.departure.iataCode,
              city: firstSegment.departure.iataCode, // Replace with actual city name if available
            })
            setArrivalLocation({
              code: lastSegment.arrival.iataCode,
              city: lastSegment.arrival.iataCode, // Replace with actual city name if available
            })
          }
        } else {
          throw new Error("No flight data received")
        }
      } catch (err) {
        console.error("Error fetching flights:", err)
        setError("Failed to fetch flights. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
    if (searchParams) {
      fetch()
    }
  }, [searchParams, selectedDate])

  const getRandomPrice = () => Math.floor(4000 + Math.random() * 2000)

  const FiltersContent = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Stops</h3>
        <RadioGroup
          value={filters.stops || "all"}
          className="space-y-3"
          onValueChange={(value) => handleFilterChange("stops", value === "all" ? null : value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="stops-all" />
            <Label htmlFor="stops-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="0" id="stops-direct" />
            <Label htmlFor="stops-direct">Direct</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="stops-1" />
            <Label htmlFor="stops-1">1 Stop</Label>
          </div>
        </RadioGroup>
      </div>

      <TimeFilter
        title={`Departure time in ${departureLocation.city}`}
        location="departure"
        selected={filters.departureTime}
        onChange={(value) => handleFilterChange("departureTime", value)}
      />

      <TimeFilter
        title={`Arrival time in ${arrivalLocation.city}`}
        location="arrival"
        selected={filters.arrivalTime}
        onChange={(value) => handleFilterChange("arrivalTime", value)}
      />

      <div>
        <h3 className="text-lg font-semibold mb-4">Airlines</h3>
        <RadioGroup
          value={filters.airline || "all"}
          className="space-y-3"
          onValueChange={(value) => handleFilterChange("airline", value === "all" ? null : value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="airline-all" />
            <Label htmlFor="airline-all">All Airlines</Label>
          </div>
          {Object.entries(carriers).map(([code, name]) => (
            <div key={code} className="flex items-center space-x-2">
              <RadioGroupItem value={code} id={`airline-${code}`} />
              <Label htmlFor={`airline-${code}`}>{name}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  )

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="p-8 text-center text-red-500 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p>{error}</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-2 sm:py-4 lg:py-6">
        {/* Title */}
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold mb-4 sm:mb-6 text-center">
          Flights for {format(selectedDate, "EEEE, MMMM d, yyyy")}
        </h1>

        {/* Date Navigation */}
        <div className="sticky top-0 z-20 bg-gray-50 py-2 mb-4">
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow-sm hover:bg-gray-100"
                onClick={() => navigateDate("prev")}
              >
                <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>

            <div className="relative overflow-hidden mx-8 sm:mx-12">
              <div className="flex items-stretch justify-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-2">
                {dateRange.map((date, index) => {
                  const isSelected = date.getTime() === selectedDate.getTime()
                  return (
                    <button
                      key={index}
                      onClick={() => handleDateChange(date)}
                      className={cn(
                        "flex-shrink-0 w-[80px] sm:w-[120px] rounded-lg p-2 sm:p-3 transition-all",
                        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                        isSelected ? "bg-[#15171a] text-white" : "bg-white hover:bg-gray-50 border border-gray-200",
                      )}
                    >
                      <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                        <span className="text-[11px] sm:text-sm font-medium">{format(date, "EEE")}</span>
                        <span className="text-[11px] sm:text-sm">{format(date, "MMM d")}</span>
                        <span className={cn("text-xs sm:text-base font-bold", !isSelected && "text-primary")}>
                          ₹{getRandomPrice()}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-white shadow-sm hover:bg-gray-100"
                onClick={() => navigateDate("next")}
              >
                <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
          {/* Filters - Desktop */}
          <Card className="hidden lg:block lg:col-span-3 p-4 sm:p-6 h-fit">
            <FiltersContent />
          </Card>

          {/* Filters - Mobile */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="lg:hidden w-full sticky top-0 z-10 bg-white shadow-sm">
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
                <FiltersContent />
              </div>
            </SheetContent>
          </Sheet>

          {/* Flight List */}
          <div className="lg:col-span-9 space-y-2 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <h2 className="text-base sm:text-lg font-semibold">
                {isLoading ? "Searching flights..." : `${filteredFlights.length} flights found`}
              </h2>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-full sm:w-[200px] text-sm sm:text-base">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RECOMMENDED">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowUpDown className="h-4 w-4" />
                      Recommended
                    </div>
                  </SelectItem>
                  <SelectItem value="PRICE_LOW_TO_HIGH">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Price (lowest to highest)
                    </div>
                  </SelectItem>
                  <SelectItem value="PRICE_HIGH_TO_LOW">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Price (highest to lowest)
                    </div>
                  </SelectItem>
                  <SelectItem value="DURATION_SHORT_TO_LONG">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Duration (shortest)
                    </div>
                  </SelectItem>
                  <SelectItem value="DURATION_LONG_TO_SHORT">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Duration (longest)
                    </div>
                  </SelectItem>
                  <SelectItem value="DEPARTURE_EARLIEST">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Departure (earliest)
                    </div>
                  </SelectItem>
                  <SelectItem value="DEPARTURE_LATEST">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Departure (latest)
                    </div>
                  </SelectItem>
                  <SelectItem value="ARRIVAL_EARLIEST">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Arrival (earliest)
                    </div>
                  </SelectItem>
                  <SelectItem value="ARRIVAL_LATEST">
                    <div className="flex items-center gap-2 text-sm sm:text-base">
                      <ArrowDownUp className="h-4 w-4" />
                      Arrival (latest)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : sortedFlights.length > 0 ? (
              <div className="space-y-3 sm:space-y-4">
                {sortedFlights.map((flight, index) => (
                  <FlightCard
                    key={index}
                    flight={flight}
                    carriers={carriers}
                    onClick={() => handleFlightSelect(flight)}
                  />
                ))}
              </div>
            ) : (
              <Card className="p-6 sm:p-8 text-center text-gray-500">
                No flights found. Please try different search criteria.
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FlightListPage

