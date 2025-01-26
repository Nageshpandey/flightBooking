import type React from "react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CreditCard, User, MapPin, Plane, Calendar, Phone, Mail, Clock, ChevronsRight } from "lucide-react"

const CheckoutPage: React.FC = () => {
  // Keeping all your existing state and logic
  const location = useLocation()
  const navigate = useNavigate()
  const flight = location.state?.flight
  const [formData, setFormData] = useState({
    title: "",
    surname: "",
    givenName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    cardType: "",
    nameOnCard: "",
    cardNumber: "",
    expiryDate: "",
    securityCode: "",
    billingAddress: {
      line1: "",
      line2: "",
      city: "",
      postalCode: "",
      pan: "",
    },
  })

  // Keeping all your existing helper functions
  const { itineraries, price, validatingAirlineCodes } = flight || {}
  const departureSegment = itineraries?.[0]?.segments[0]
  const arrivalSegment = itineraries?.[0]?.segments.slice(-1)[0]

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

  const formattedPrice = flight ? formatPriceToINR(Number.parseFloat(price.total.toString()), price.currency) : ""

  useEffect(() => {
    if (!flight) {
      navigate("/")
    }
  }, [flight, navigate])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({ ...prevData, [name]: value }))
  }
  

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      billingAddress: { ...prevData.billingAddress, [field]: value },
    }))
  }

  const handleSubmit = () => {
    alert("Booking Confirmed!")
  }

  if (!flight) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-semibold text-gray-900">Complete Your Booking</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Mr./Ms."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="givenName">Given Name</Label>
                  <Input
                    id="givenName"
                    name="givenName"
                    value={formData.givenName}
                    onChange={handleInputChange}
                    placeholder="First Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@mail.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 123 456 7890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  Payment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <RadioGroup defaultValue="credit" className="grid grid-cols-3 gap-4">
                  <Label
                    htmlFor="credit"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="credit" id="credit" className="sr-only" />
                    <CreditCard className="mb-3 h-6 w-6" />
                    Credit Card
                  </Label>
                  <Label
                    htmlFor="debit"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="debit" id="debit" className="sr-only" />
                    <CreditCard className="mb-3 h-6 w-6" />
                    Debit Card
                  </Label>
                  <Label
                    htmlFor="upi"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                  >
                    <RadioGroupItem value="upi" id="upi" className="sr-only" />
                    <CreditCard className="mb-3 h-6 w-6" />
                    UPI
                  </Label>
                </RadioGroup>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nameOnCard">Name on Card</Label>
                    <Input
                      id="nameOnCard"
                      name="nameOnCard"
                      value={formData.nameOnCard}
                      onChange={handleInputChange}
                      placeholder="Cardholder Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiryDate">Expiry Date</Label>
                    <Input
                      id="expiryDate"
                      name="expiryDate"
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="securityCode">Security Code (CVV)</Label>
                    <Input
                      id="securityCode"
                      name="securityCode"
                      value={formData.securityCode}
                      onChange={handleInputChange}
                      placeholder="123"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Billing Address
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.line1">Address Line 1</Label>
                  <Input
                    id="billingAddress.line1"
                    name="billingAddress.line1"
                    value={formData.billingAddress.line1}
                    onChange={(e) => handleBillingAddressChange(e, "line1")}
                    placeholder="Street Address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.line2">Address Line 2</Label>
                  <Input
                    id="billingAddress.line2"
                    name="billingAddress.line2"
                    value={formData.billingAddress.line2}
                    onChange={(e) => handleBillingAddressChange(e, "line2")}
                    placeholder="Apartment, Suite, etc."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.city">City</Label>
                  <Input
                    id="billingAddress.city"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={(e) => handleBillingAddressChange(e, "city")}
                    placeholder="City"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.postalCode">Postal Code</Label>
                  <Input
                    id="billingAddress.postalCode"
                    name="billingAddress.postalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={(e) => handleBillingAddressChange(e, "postalCode")}
                    placeholder="Postal Code"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingAddress.pan">PAN</Label>
                  <Input
                    id="billingAddress.pan"
                    name="billingAddress.pan"
                    value={formData.billingAddress.pan}
                    onChange={(e) => handleBillingAddressChange(e, "pan")}
                    placeholder="Permanent Account Number"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Flight ID</span>
                    <span>{flight.id}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-2 text-sm">
                    <Plane className="h-4 w-4" />
                    <span>{validatingAirlineCodes.join(", ")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ChevronsRight className="h-4 w-4" />
                    <span>
                      {departureSegment?.departure?.iataCode} → {arrivalSegment?.arrival?.iataCode}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Duration: {itineraries[0]?.duration || "N/A"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(departureSegment?.departure?.at).toLocaleDateString()}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-medium">
                    <span>Total Amount</span>
                    <span className="text-lg">{formattedPrice}</span>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>• Secure payment processing</p>
                  <p>• Instant confirmation</p>
                  <p>• 24/7 customer support</p>
                </div>

                <Button className="w-full" size="lg" onClick={handleSubmit}>
                  Confirm Booking
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By clicking "Confirm Booking", you agree to our terms and conditions
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

export default CheckoutPage

