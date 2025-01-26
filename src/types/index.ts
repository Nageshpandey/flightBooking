export interface FlightSearchParams {
  originLocationCode: string;
  destinationLocationCode: string;
  departureDate: string;
  returnDate?: string; // Optional for one-way or multi-city
  adults: number;
  children: number;
  infants?: number;
  travelClass?: string;
  nonStop?: boolean;
  max: number;
  multiCityDestinations?: string[]; // Multi-city destinations
}

// src/types/index.ts
export interface FlightOffer {
  id: string;
  price: {
    total: number;
    base: number;
    currency: string;
  };
  itineraries: {
    segments: {
      departure: {
        at: string;
        iataCode: string;
        terminal?: string;
      };
      arrival: {
        at: string;
        iataCode: string;
        terminal?: string;
      };
      numberOfStops: number;
    }[];
  }[];
  travelerPricings: {
    fareDetailsBySegment: {
      cabin: string;
      baggageAllowance?: {
        weight: number;
        unit: string;
      }[];
    }[];
  }[];
  validatingAirlineCodes: string[];
}
