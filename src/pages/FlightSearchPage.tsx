import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FlightSearchForm } from '../components/FlightSearchForm';
import { fetchAirports, fetchCities } from '../lib/api';

const FlightSearchPage: React.FC = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState<{ iataCode: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ name: string }[]>([]);

  const handleAirportSearch = async (query: string) => {
    try {
      const results = await fetchAirports(query);
      setAirports(results);
    } catch (error) {
      console.error('Error fetching airports:', error);
    }
  };

  const handleCitySearch = async (query: string) => {
    try {
      const results = await fetchCities(query); // Implement this in your API
      setCities(results);
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const handleSearch = (params: any) => {
    navigate('/flights', { state: { searchParams: params } });
  };

  return (
    <div className="">
      {/* <header className="bg-white shadow-sm">
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Search Flights</h1>
        </div>
      </header> */}

      <main className="w-full mx-auto">
        <div className="">
          <FlightSearchForm
            onSearch={handleSearch}
            onAirportSearch={handleAirportSearch}
            onCitySearch={handleCitySearch}
            airports={airports}
            cities={cities}
          />
        </div>
      </main>
    </div>
  );
};

export default FlightSearchPage;
