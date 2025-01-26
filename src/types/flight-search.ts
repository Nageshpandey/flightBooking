export interface Airport {
  iataCode: string
  name: string
  city: string
}

export interface FlightLeg {
  origin: string
  destination: string
  departureDate: string
  travelClass: "economy" | "business" | "first"
}

export type TripType = "oneway" | "roundtrip" | "multiCity"

export interface FlightSearchParams {
  originLocationCode: string
  destinationLocationCode: string
  departureDate: string
  returnDate?: string
  adults: number
  children: number
  nonStop: boolean
  max: number
  tripType: TripType
  travelClass: string
}

