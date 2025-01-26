import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FlightSearchForm } from "../components/FlightSearchForm"
import { fetchAirports, fetchCities } from "../lib/api"
import backgroundImage from "../asset/11045.jpg"

const FlightSearchPage: React.FC = () => {
  const navigate = useNavigate()
  const [airports, setAirports] = useState<{ iataCode: string; name: string; city: string }[]>([])
  const [cities, setCities] = useState<{ name: string }[]>([])

  const handleAirportSearch = async (query: string) => {
    try {
      const results = await fetchAirports(query)
      setAirports(results)
    } catch (error) {
      console.error("Error fetching airports:", error)
    }
  }

  const handleCitySearch = async (query: string) => {
    try {
      const results = await fetchCities(query)
      setCities(results)
    } catch (error) {
      console.error("Error fetching cities:", error)
    }
  }

  const handleSearch = (params: any) => {
    navigate("/flights", { state: { searchParams: params } })
  }

  return (
    <div
      className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center w-full h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <FlightSearchForm onSearch={handleSearch} onAirportSearch={handleAirportSearch} airports={airports} />
    </div>
  )
}

export default FlightSearchPage

