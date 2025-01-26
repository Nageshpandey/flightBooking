"use client"

import * as React from "react"
import type { FlightSearchParams } from "../types"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  AlertCircle,
  CalendarIcon,
  MapPin,
  Minus,
  Plus,
  FlipHorizontalIcon as SwapHorizontal,
  User,
  PlusCircle,
} from "lucide-react"
interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams | FlightSearchParams[]) => void
  onAirportSearch: (query: string) => void
  airports: { iataCode: string; name: string; city: string }[]
}

interface FormErrors {
  origin?: string
  destination?: string
  departureDate?: string
  returnDate?: string
  general?: string[]
  multiCity?: {
    origin?: string
    destination?: string
    departureDate?: string
  }[]
}

export function FlightSearchForm({ onSearch, onAirportSearch, airports }: FlightSearchFormProps) {
  const [origin, setOrigin] = React.useState("")
  const [destination, setDestination] = React.useState("")
  const [departureDate, setDepartureDate] = React.useState<Date>()
  const [returnDate, setReturnDate] = React.useState<Date>()
  const [adults, setAdults] = React.useState(1)
  const [children, setChildren] = React.useState(0)
  const [tripType, setTripType] = React.useState("return")
  const [travelClass, setTravelClass] = React.useState("economy")
  const [showTravelers, setShowTravelers] = React.useState(false)
  const [errors, setErrors] = React.useState<FormErrors>({})
  const [multiCityFlights, setMultiCityFlights] = React.useState([
    { origin: "", destination: "", departureDate: undefined as Date | undefined, travelClass: "economy" },
  ])

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (tripType === "multiCity") {
      const multiCityErrors: FormErrors["multiCity"] = []
      let hasErrors = false

      multiCityFlights.forEach((flight, index) => {
        const flightErrors: FormErrors["multiCity"][0] = {}

        if (!flight.origin) {
          flightErrors.origin = "Please select where you're leaving from"
          hasErrors = true
        }
        if (!flight.destination) {
          flightErrors.destination = "Please select where you're going to"
          hasErrors = true
        }
        if (!flight.departureDate) {
          flightErrors.departureDate = "Please select a departure date"
          hasErrors = true
        }

        multiCityErrors[index] = flightErrors
      })

      if (hasErrors) {
        newErrors.multiCity = multiCityErrors
      }
    } else {
      if (!origin) {
        newErrors.origin = "Please select where you're leaving from"
      }
      if (!destination) {
        newErrors.destination = "Please select where you're going to"
      }
      if (!departureDate) {
        newErrors.departureDate = "Please select a departure date"
      }
      if (tripType === "return" && !returnDate) {
        newErrors.returnDate = "Please select a return date"
      }
      if (origin === destination && origin !== "") {
        newErrors.general = ["Origin and destination cannot be the same"]
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (tripType === "multiCity") {
      const flightParams = multiCityFlights.map((flight) => ({
        originLocationCode: flight.origin,
        destinationLocationCode: flight.destination,
        departureDate: flight.departureDate ? format(flight.departureDate, "yyyy-MM-dd") : "",
        adults,
        children,
        nonStop: false,
        max: 250,
        tripType,
        travelClass: flight.travelClass,
      }))
      onSearch(flightParams)
    } else {
      onSearch({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate: departureDate ? format(departureDate, "yyyy-MM-dd") : "",
        returnDate: tripType === "return" && returnDate ? format(returnDate, "yyyy-MM-dd") : undefined,
        adults,
        children,
        nonStop: false,
        max: 250,
        tripType,
        travelClass,
      })
    }
  }

  const handleOriginChange = (value: string) => {
    setOrigin(value)
    onAirportSearch(value)
    if (errors.origin) {
      setErrors((prev) => ({ ...prev, origin: undefined }))
    }
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    onAirportSearch(value)
    if (errors.destination) {
      setErrors((prev) => ({ ...prev, destination: undefined }))
    }
  }

  const handleMultiCityOriginChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights]
    newFlights[index].origin = value
    setMultiCityFlights(newFlights)
    onAirportSearch(value)
    if (errors.multiCity?.[index]?.origin) {
      const newErrors = { ...errors }
      if (newErrors.multiCity?.[index]) {
        newErrors.multiCity[index].origin = undefined
      }
      setErrors(newErrors)
    }
  }

  const handleMultiCityDestinationChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights]
    newFlights[index].destination = value
    setMultiCityFlights(newFlights)
    onAirportSearch(value)
    if (errors.multiCity?.[index]?.destination) {
      const newErrors = { ...errors }
      if (newErrors.multiCity?.[index]) {
        newErrors.multiCity[index].destination = undefined
      }
      setErrors(newErrors)
    }
  }

  const handleDepartureDateChange = (index: number, value: Date | undefined) => {
    const newFlights = [...multiCityFlights]
    newFlights[index].departureDate = value
    setMultiCityFlights(newFlights)
    if (errors.multiCity?.[index]?.departureDate) {
      const newErrors = { ...errors }
      if (newErrors.multiCity?.[index]) {
        newErrors.multiCity[index].departureDate = undefined
      }
      setErrors(newErrors)
    }
  }

  const handleClassChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights]
    newFlights[index].travelClass = value
    setMultiCityFlights(newFlights)
  }

  const addFlight = () => {
    setMultiCityFlights([
      ...multiCityFlights,
      { origin: "", destination: "", departureDate: undefined, travelClass: "economy" },
    ])
  }

  const swapLocations = () => {
    setOrigin(destination)
    setDestination(origin)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white/10 backdrop-blur-md rounded-xl shadow-2xl border border-white/20">
      <form onSubmit={handleSubmit}>
        {(errors.general?.length > 0 || Object.keys(errors).length > 0) && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please correct the {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? "s" : ""} to
              continue
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Button
            variant={tripType === "return" ? "default" : "ghost"}
            className={cn("text-sm font-medium", tripType === "return" && "bg-blue-600 text-white hover:bg-blue-700")}
            onClick={() => setTripType("return")}
            type="button"
          >
            Return
          </Button>
          <Button
            variant={tripType === "oneway" ? "default" : "ghost"}
            className={cn("text-sm font-medium", tripType === "oneway" && "bg-blue-600 text-white hover:bg-blue-700")}
            onClick={() => setTripType("oneway")}
            type="button"
          >
            One-way
          </Button>
          <Button
            variant={tripType === "multiCity" ? "default" : "ghost"}
            className={cn(
              "text-sm font-medium",
              tripType === "multiCity" && "bg-blue-600 text-white hover:bg-blue-700",
            )}
            onClick={() => setTripType("multiCity")}
            type="button"
          >
            Multi-city
          </Button>
          <Select value={travelClass} onValueChange={setTravelClass}>
            <SelectTrigger className="w-[140px] border-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="economy">Economy</SelectItem>
              <SelectItem value="premium">Premium Economy</SelectItem>
              <SelectItem value="business">Business</SelectItem>
              <SelectItem value="first">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {tripType === "multiCity" ? (
          <div className="space-y-4">
            {multiCityFlights.map((flight, index) => (
              <div key={index} className="space-y-4">
                <div className="text-sm font-medium">Flight {index + 1}</div>
                <div className="grid gap-4">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Leaving from"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-600",
                          errors.multiCity?.[index]?.origin && "border-red-500",
                        )}
                        value={flight.origin}
                        onChange={(e) => handleMultiCityOriginChange(index, e.target.value)}
                        list={`airport-options-origin-${index}`}
                      />
                      {errors.multiCity?.[index]?.origin && (
                        <div className="text-red-500 text-sm mt-1">{errors.multiCity[index].origin}</div>
                      )}
                      <datalist id={`airport-options-origin-${index}`}>
                        {airports.map((airport) => (
                          <option key={airport.iataCode} value={airport.iataCode}>
                            {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                          </option>
                        ))}
                      </datalist>
                    </div>
                    <div className="flex-1 relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2">
                        <MapPin className="h-5 w-5 text-gray-500" />
                      </div>
                      <input
                        type="text"
                        placeholder="Going to"
                        className={cn(
                          "w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-600",
                          errors.multiCity?.[index]?.destination && "border-red-500",
                        )}
                        value={flight.destination}
                        onChange={(e) => handleMultiCityDestinationChange(index, e.target.value)}
                        list={`airport-options-destination-${index}`}
                      />
                      {errors.multiCity?.[index]?.destination && (
                        <div className="text-red-500 text-sm mt-1">{errors.multiCity[index].destination}</div>
                      )}
                      <datalist id={`airport-options-destination-${index}`}>
                        {airports.map((airport) => (
                          <option key={airport.iataCode} value={airport.iataCode}>
                            {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                          </option>
                        ))}
                      </datalist>
                    </div>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-[300px] justify-start text-left font-normal border-2",
                            errors.multiCity?.[index]?.departureDate && "border-red-500",
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {flight.departureDate ? format(flight.departureDate, "d MMM") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={flight.departureDate}
                          onSelect={(date) => handleDepartureDateChange(index, date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  {errors.multiCity?.[index]?.departureDate && (
                    <div className="text-red-500 text-sm">{errors.multiCity[index].departureDate}</div>
                  )}
                </div>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <Button type="button" onClick={addFlight} variant="outline" className="flex-1">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Flight
              </Button>
              <Popover open={showTravelers} onOpenChange={setShowTravelers}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start text-left font-normal border-2">
                    <User className="mr-2 h-4 w-4" />
                    {adults + children} {adults + children === 1 ? "traveller" : "travellers"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Adults</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          disabled={adults <= 1}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{adults}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setAdults(adults + 1)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Children</div>
                        <div className="text-sm text-gray-500">Ages 2 to 17</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          disabled={children <= 0}
                          type="button"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="w-8 text-center">{children}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() => setChildren(children + 1)}
                          type="button"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => setShowTravelers(false)}
                      type="button"
                    >
                      Done
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                Search
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Leaving from"
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-600",
                  errors.origin && "border-red-500",
                )}
                value={origin}
                onChange={(e) => handleOriginChange(e.target.value)}
                list="airport-options-origin"
              />
              {errors.origin && <div className="text-red-500 text-sm mt-1">{errors.origin}</div>}
              <datalist id="airport-options-origin">
                {airports.map((airport) => (
                  <option key={airport.iataCode} value={airport.iataCode}>
                    {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Going to"
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg border-2 focus:outline-none focus:border-blue-600",
                  errors.destination && "border-red-500",
                )}
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                list="airport-options-destination"
              />
              {errors.destination && <div className="text-red-500 text-sm mt-1">{errors.destination}</div>}
              <datalist id="airport-options-destination">
                {airports.map((airport) => (
                  <option key={airport.iataCode} value={airport.iataCode}>
                    {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                  </option>
                ))}
              </datalist>
            </div>
            <div className="sm:col-span-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[300px] justify-start text-left font-normal border-2",
                      (errors.departureDate || errors.returnDate) && "border-red-500",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {departureDate && returnDate && tripType === "return" ? (
                      <>
                        {format(departureDate, "d MMM")} - {format(returnDate, "d MMM")}
                      </>
                    ) : departureDate ? (
                      format(departureDate, "d MMM")
                    ) : (
                      "Select dates"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode={tripType === "return" ? "range" : "single"}
                    selected={tripType === "return" ? { from: departureDate, to: returnDate } : departureDate}
                    onSelect={
                      tripType === "return"
                        ? (range) => {
                            setDepartureDate(range?.from)
                            setReturnDate(range?.to)
                            if (errors.departureDate) setErrors((prev) => ({ ...prev, departureDate: undefined }))
                            if (errors.returnDate) setErrors((prev) => ({ ...prev, returnDate: undefined }))
                          }
                        : (date) => {
                            setDepartureDate(date)
                            if (errors.departureDate) setErrors((prev) => ({ ...prev, departureDate: undefined }))
                          }
                    }
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-4">
          <Popover open={showTravelers} onOpenChange={setShowTravelers}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-start text-left font-normal border-2">
                <User className="mr-2 h-4 w-4" />
                {adults + children} {adults + children === 1 ? "traveller" : "travellers"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Adults</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      disabled={adults <= 1}
                      type="button"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{adults}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setAdults(adults + 1)}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Children</div>
                    <div className="text-sm text-gray-500">Ages 2 to 17</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      disabled={children <= 0}
                      type="button"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{children}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => setChildren(children + 1)}
                      type="button"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button
                  className="w-full bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => setShowTravelers(false)}
                  type="button"
                >
                  Done
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            Search
          </Button>
        </div>

        <div className="flex items-center gap-6 mt-4">
          <div className="flex items-center space-x-2">
            <Checkbox id="stay" />
            <label
              htmlFor="stay"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add a place to stay
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="car" />
            <label
              htmlFor="car"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Add a car
            </label>
          </div>
        </div>
      </form>
    </div>
  )
}

