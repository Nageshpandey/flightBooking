import type React from "react"
import { createContext, useState, useContext } from "react"

interface FlightContextType {
  searchParams: any
  setSearchParams: (params: any) => void
  selectedFlight: any
  setSelectedFlight: (flight: any) => void
}

const FlightContext = createContext<FlightContextType | undefined>(undefined)

export const FlightProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchParams, setSearchParams] = useState({})
  const [selectedFlight, setSelectedFlight] = useState(null)

  return (
    <FlightContext.Provider value={{ searchParams, setSearchParams, selectedFlight, setSelectedFlight }}>
      {children}
    </FlightContext.Provider>
  )
}

export const useFlightContext = () => {
  const context = useContext(FlightContext)
  if (context === undefined) {
    throw new Error("useFlightContext must be used within a FlightProvider")
  }
  return context
}

