import type React from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Info, Plane, Clock, Calendar, CreditCard } from "lucide-react"

const ReviewTripPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const flight = location.state?.flight

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <CardTitle className="mb-4">No Flight Selected</CardTitle>
          <CardContent>
            <p>Please select a flight from the list to review your trip.</p>
            <Button className="mt-4" onClick={() => navigate("/flights")}>
              Back to Flight List
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { itineraries, price, validatingAirlineCodes, travelerPricings } = flight
  const departureSegment = itineraries[0]?.segments[0]
  const arrivalSegment = itineraries[0]?.segments.slice(-1)[0]

  const formatTime = (time: string) => {
    const date = new Date(time)
    return date.toLocaleString("en-IN", {
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatPriceToINR = (amount: number, currency: string) => {
    if (currency === "INR") {
      return `₹${amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
    }

    const conversionRates: { [key: string]: number } = {
      USD: 83.0,
      EUR: 90.0,
      GBP: 103.0,
    }

    const convertedAmount = conversionRates[currency] ? amount * conversionRates[currency] : amount

    return `₹${convertedAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
  }

  const totalCost = Number.parseFloat(price?.total || "0")
  const baseCost = Number.parseFloat(price?.base || "0")
  const fees = Number.parseFloat(price?.fees?.[0]?.amount || "0")
  const currency = price?.currency || "INR"

  const formattedBaseCost = formatPriceToINR(baseCost, currency)
  const formattedFees = formatPriceToINR(fees, currency)
  const formattedTotalCost = formatPriceToINR(totalCost, currency)

  const flightAmenities = travelerPricings[0]?.fareDetailsBySegment[0]?.amenities || []

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Review Your Trip</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-6">
          {/* Flight Details Card */}
          <Card className="md:col-span-2">
            <CardContent className="p-6 space-y-6">
              {/* Flight Route Information */}
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Plane className="h-5 w-5 text-primary" />
                      <h2 className="text-xl font-semibold">
                        {departureSegment?.departure?.iataCode} → {arrivalSegment?.arrival?.iataCode}
                      </h2>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Duration: {itineraries[0]?.duration}</span>
                    </div>
                  </div>
                  <Badge variant="outline">{validatingAirlineCodes.join(", ")}</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Departure</p>
                    <p className="font-medium">
                      {departureSegment ? formatTime(departureSegment.departure.at) : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Arrival</p>
                    <p className="font-medium">{arrivalSegment ? formatTime(arrivalSegment.arrival.at) : "N/A"}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Fare Breakdown */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Fare Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Flight Cost</span>
                    <span>{formattedBaseCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span>{formattedFees}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Total per Traveler</span>
                    <span>{formattedTotalCost}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total Trip Cost</span>
                    <span>{formattedTotalCost}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Flight Amenities */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Flight Amenities</h3>
                {flightAmenities.length > 0 ? (
                  <div className="grid gap-2">
                    {flightAmenities.map((amenity: any, index: number) => (
                      <div key={index} className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium">{amenity.amenityType}</p>
                          <p className="text-sm text-muted-foreground">
                            {amenity.description}
                            {amenity.isChargeable && <span className="text-primary"> (Chargeable)</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No amenities available for this flight.</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <Button variant="outline" onClick={() => navigate("/flights")}>
                  Change Flight
                </Button>
                <Button onClick={() => navigate("/checkout", { state: { flight, travelerPricings } })}>
                  Continue to Checkout
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Price Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fare</span>
                  <span>{formattedBaseCost}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span>{formattedFees}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{formattedTotalCost}</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">All prices are quoted in Indian Rupees (INR)</p>
              <Button className="w-full" size="lg">
                Proceed to Payment
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default ReviewTripPage

