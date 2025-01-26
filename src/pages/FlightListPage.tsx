import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FlightCard } from '../components/FlightCard';
import { fetchFlights } from '../lib/api';
import { FlightOffer } from '../types';

const FlightListPage: React.FC = () => {
  const location = useLocation();
  const searchParams = location.state?.searchParams;
  const [flights, setFlights] = useState<FlightOffer[]>([]);
  const [carriers, setCarriers] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    stops: null as string | null,
    airline: null as string | null,
    baggage: null as boolean | null,
    departureTime: null as string | null,
    arrivalTime: null as string | null,
  });
  const [sortOption, setSortOption] = useState('RECOMMENDED'); // Default to "Recommended"

  // Fetch flights on page load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { offers, carriers } = await fetchFlights(searchParams);
        setFlights(offers);
        setCarriers(carriers);
      } catch (error) {
        console.error('Error fetching flights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (searchParams) {
      fetchData();
    }
  }, [searchParams]);

  // Filter flights based on filters
  const filterFlights = (flight: FlightOffer) => {
    const segment = flight.itineraries[0].segments[0];
    const lastSegment = flight.itineraries[0].segments.slice(-1)[0];

    return (
      (!filters.stops || filters.stops === segment.numberOfStops.toString()) &&
      (!filters.airline || flight.validatingAirlineCodes.includes(filters.airline)) &&
      (!filters.baggage || flight.travelerPricings.some((tp) =>
        tp.fareDetailsBySegment.some((fd) => fd.baggageAllowance && fd.baggageAllowance.length > 0)
      )) &&
      (!filters.departureTime ||
        (filters.departureTime === 'morning' && new Date(segment.departure.at).getHours() < 12) ||
        (filters.departureTime === 'afternoon' &&
          new Date(segment.departure.at).getHours() >= 12 &&
          new Date(segment.departure.at).getHours() < 18) ||
        (filters.departureTime === 'evening' && new Date(segment.departure.at).getHours() >= 18)) &&
      (!filters.arrivalTime ||
        (filters.arrivalTime === 'morning' && new Date(lastSegment.arrival.at).getHours() < 12) ||
        (filters.arrivalTime === 'afternoon' &&
          new Date(lastSegment.arrival.at).getHours() >= 12 &&
          new Date(lastSegment.arrival.at).getHours() < 18) ||
        (filters.arrivalTime === 'evening' && new Date(lastSegment.arrival.at).getHours() >= 18))
    );
  };

  const filteredFlights = useMemo(() => flights.filter(filterFlights), [flights, filters]);

  // Function to calculate duration in minutes
  const calculateDuration = (itinerary: { segments: { departure: { at: string }; arrival: { at: string } }[] }) => {
    const departureTime = new Date(itinerary.segments[0].departure.at).getTime();
    const arrivalTime = new Date(itinerary.segments[itinerary.segments.length - 1].arrival.at).getTime();
    return (arrivalTime - departureTime) / (1000 * 60); // Convert milliseconds to minutes
  };

  // Sort flights based on selected sort option
  const sortedFlights = useMemo(() => {
    const sorted = [...filteredFlights];
    switch (sortOption) {
      case 'PRICE_LOW_TO_HIGH':
        return sorted.sort((a, b) => a.price.total - b.price.total);
      case 'PRICE_HIGH_TO_LOW':
        return sorted.sort((a, b) => b.price.total - a.price.total);
      case 'DURATION_SHORT_TO_LONG':
        return sorted.sort(
          (a, b) => calculateDuration(a.itineraries[0]) - calculateDuration(b.itineraries[0])
        );
      case 'DURATION_LONG_TO_SHORT':
        return sorted.sort(
          (a, b) => calculateDuration(b.itineraries[0]) - calculateDuration(a.itineraries[0])
        );
      case 'RECOMMENDED':
      default:
        return sorted; // Keep the default "Recommended" order
    }
  }, [filteredFlights, sortOption]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Handle sort option change
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Flight Results</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6">
        {/* Filters Section */}
        <aside className="col-span-12 md:col-span-4 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="space-y-4">
            {/* Stops Filter */}
            <div>
              <label htmlFor="stops" className="block text-sm font-medium text-gray-700">
                Stops
              </label>
              <select
                id="stops"
                onChange={(e) => handleFilterChange('stops', e.target.value || null)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="0">Non-stop</option>
                <option value="1">1 stop</option>
                <option value="2+">2+ stops</option>
              </select>
            </div>

            {/* Airline Filter */}
            <div>
              <label htmlFor="airline" className="block text-sm font-medium text-gray-700">
                Airline
              </label>
              <input
                type="text"
                id="airline"
                placeholder="Enter airline name"
                onChange={(e) => handleFilterChange('airline', e.target.value || null)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              />
            </div>

            {/* Hand Baggage Filter */}
            <div>
              <label htmlFor="baggage" className="block text-sm font-medium text-gray-700">
                Hand Baggage
              </label>
              <input
                type="checkbox"
                id="baggage"
                onChange={(e) => handleFilterChange('baggage', e.target.checked)}
                className="mt-1 block"
              />
            </div>

            {/* Departure Time Filter */}
            <div>
              <label htmlFor="departureTime" className="block text-sm font-medium text-gray-700">
                Departure Time
              </label>
              <select
                id="departureTime"
                onChange={(e) => handleFilterChange('departureTime', e.target.value || null)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="morning">Morning (05:00 - 11:59)</option>
                <option value="afternoon">Afternoon (12:00 - 17:59)</option>
                <option value="evening">Evening (18:00 - 23:59)</option>
              </select>
            </div>

            {/* Arrival Time Filter */}
            <div>
              <label htmlFor="arrivalTime" className="block text-sm font-medium text-gray-700">
                Arrival Time
              </label>
              <select
                id="arrivalTime"
                onChange={(e) => handleFilterChange('arrivalTime', e.target.value || null)}
                className="mt-1 block w-full border border-gray-300 rounded-md"
              >
                <option value="">Any</option>
                <option value="morning">Morning (05:00 - 11:59)</option>
                <option value="afternoon">Afternoon (12:00 - 17:59)</option>
                <option value="evening">Evening (18:00 - 23:59)</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Flight List Section */}
        <section className="col-span-12 md:col-span-8 bg-white rounded-lg shadow-sm p-6">
          {/* Sort Dropdown */}
          <div className="mb-4 flex justify-end">
            <label htmlFor="sortDropdown" className="sr-only">
              Sort by
            </label>
            <select
              id="sortDropdown"
              value={sortOption}
              onChange={handleSortChange}
              className="block w-full md:w-1/3 border border-gray-300 rounded-md"
            >
              <option value="RECOMMENDED">Recommended</option>
              <option value="PRICE_LOW_TO_HIGH">Price (low to high)</option>
              <option value="PRICE_HIGH_TO_LOW">Price (high to low)</option>
              <option value="DURATION_SHORT_TO_LONG">Duration (short to long)</option>
              <option value="DURATION_LONG_TO_SHORT">Duration (long to short)</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center">Loading...</div>
          ) : sortedFlights.length > 0 ? (
            <div className="space-y-4">
              {sortedFlights.map((flight, index) => (
                <FlightCard key={index} flight={flight} carriers={carriers} />
              ))}
            </div>
          ) : (
            <div>No flights found. Please try different search criteria.</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default FlightListPage;