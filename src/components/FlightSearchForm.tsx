import React, { useState } from 'react';
import { FlightSearchParams } from '../types';
import backgroundImage from '../asset/11045.jpg';

interface FlightSearchFormProps {
  onSearch: (params: FlightSearchParams | FlightSearchParams[]) => void;
  onAirportSearch: (query: string) => void;
  airports: { iataCode: string; name: string; city: string }[];
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch, onAirportSearch, airports }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [tripType, setTripType] = useState('oneway');
  const [travelClass, setTravelClass] = useState('economy');
  const [multiCityFlights, setMultiCityFlights] = useState([{ origin: '', destination: '', departureDate: '', travelClass: 'economy' }]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (tripType === 'multiCity') {
      const flightParams = multiCityFlights.map((flight) => ({
        originLocationCode: flight.origin,
        destinationLocationCode: flight.destination,
        departureDate: flight.departureDate,
        adults,
        children,
        nonStop: false,
        max: 250,
        tripType,
        travelClass: flight.travelClass,
      }));
      onSearch(flightParams);
    } else {
      onSearch({
        originLocationCode: origin,
        destinationLocationCode: destination,
        departureDate,
        returnDate: tripType === 'roundtrip' ? returnDate : undefined,
        adults,
        children,
        nonStop: false,
        max: 250,
        tripType,
        travelClass,
      });
    }
  };

  const handleOriginChange = (value: string) => {
    setOrigin(value);
    onAirportSearch(value);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    onAirportSearch(value);
  };

  const handleMultiCityOriginChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights];
    newFlights[index].origin = value;
    setMultiCityFlights(newFlights);
    onAirportSearch(value);
  };

  const handleMultiCityDestinationChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights];
    newFlights[index].destination = value;
    setMultiCityFlights(newFlights);
    onAirportSearch(value);
  };

  const handleDepartureDateChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights];
    newFlights[index].departureDate = value;
    setMultiCityFlights(newFlights);
  };

  const handleClassChange = (index: number, value: string) => {
    const newFlights = [...multiCityFlights];
    newFlights[index].travelClass = value;
    setMultiCityFlights(newFlights);
  };

  const addFlight = () => {
    setMultiCityFlights([...multiCityFlights, { origin: '', destination: '', departureDate: '', travelClass: 'economy' }]);
  };

  return (
    <div
      className="bg-cover bg-center w-full h-screen"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full h-full p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg w-full max-w-lg">
          <h1 className="text-3xl font-bold text-center mb-6 text-black">Ready to take off?</h1>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <div className="flex justify-center mb-4">
              <button
                type="button"
                className={`px-4 py-2 rounded-l-lg ${tripType === 'oneway' ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => setTripType('oneway')}
              >
                One Way
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${tripType === 'roundtrip' ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => setTripType('roundtrip')}
              >
                Round Trip
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-r-lg ${tripType === 'multiCity' ? 'bg-black text-white' : 'bg-gray-200'}`}
                onClick={() => setTripType('multiCity')}
              >
                Multi-City
              </button>
            </div>

            {tripType === 'multiCity' ? (
              multiCityFlights.map((flight, index) => (
                <div key={index} className="flex flex-col space-y-4">
                  <div className="flex space-x-4">
                    <div className="flex-1">
                      <label htmlFor={`origin-${index}`} className="block text-sm font-medium text-gray-700">From</label>
                      <input
                        type="text"
                        id={`origin-${index}`}
                        value={flight.origin}
                        onChange={(e) => handleMultiCityOriginChange(index, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        list="airport-options-origin"
                        placeholder="Select location"
                        required
                      />
                      <datalist id="airport-options-origin">
                        {airports.map((airport) => (
                          <option key={airport.iataCode} value={airport.iataCode}>
                            {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    <div className="flex-1">
                      <label htmlFor={`destination-${index}`} className="block text-sm font-medium text-gray-700">To</label>
                      <input
                        type="text"
                        id={`destination-${index}`}
                        value={flight.destination}
                        onChange={(e) => handleMultiCityDestinationChange(index, e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                        list="airport-options-destination"
                        placeholder="Select location"
                        required
                      />
                      <datalist id="airport-options-destination">
                        {airports.map((airport) => (
                          <option key={airport.iataCode} value={airport.iataCode}>
                            {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                          </option>
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label htmlFor={`departureDate-${index}`} className="block text-sm font-medium text-gray-700">Departure</label>
                    <input
                      type="date"
                      id={`departureDate-${index}`}
                      value={flight.departureDate}
                      onChange={(e) => handleDepartureDateChange(index, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>

                  <div className="flex-1">
                    <label htmlFor={`travelClass-${index}`} className="block text-sm font-medium text-gray-700">Class</label>
                    <select
                      id={`travelClass-${index}`}
                      value={flight.travelClass}
                      onChange={(e) => handleClassChange(index, e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    >
                      <option value="economy">Economy</option>
                      <option value="business">Business</option>
                      <option value="first">First Class</option>
                    </select>
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700">From</label>
                    <input
                      type="text"
                      id="origin"
                      name="origin"
                      value={origin}
                      onChange={(e) => handleOriginChange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      list="airport-options-origin"
                      placeholder="Select location"
                      required
                    />
                    <datalist id="airport-options-origin">
                      {airports.map((airport) => (
                        <option key={airport.iataCode} value={airport.iataCode}>
                          {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                        </option>
                      ))}
                    </datalist>
                  </div>

                  <div className="flex-1">
                    <label htmlFor="destination" className="block text-sm font-medium text-gray-700">To</label>
                    <input
                      type="text"
                      id="destination"
                      name="destination"
                      value={destination}
                      onChange={(e) => handleDestinationChange(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      list="airport-options-destination"
                      placeholder="Select location"
                      required
                    />
                    <datalist id="airport-options-destination">
                      {airports.map((airport) => (
                        <option key={airport.iataCode} value={airport.iataCode}>
                          {`${airport.name} (${airport.iataCode}) - ${airport.city}`}
                        </option>
                      ))}
                    </datalist>
                  </div>
                </div>

                <div className="flex-1">
                  <label htmlFor="departureDate" className="block text-sm font-medium text-gray-700">Departure</label>
                  <input
                    type="date"
                    id="departureDate"
                    name="departureDate"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    required
                  />
                </div>

                {tripType === 'roundtrip' && (
                  <div className="flex-1">
                    <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700">Return</label>
                    <input
                      type="date"
                      id="returnDate"
                      name="returnDate"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                      required
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="adults" className="block text-sm font-medium text-gray-700">Adults</label>
                <input
                  type="number"
                  id="adults"
                  name="adults"
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="1"
                  required
                />
              </div>

              <div className="flex-1">
                <label htmlFor="children" className="block text-sm font-medium text-gray-700">Children</label>
                <input
                  type="number"
                  id="children"
                  name="children"
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                  min="0"
                />
              </div>
            </div>

            {tripType !== 'multiCity' && (
              <div className="flex-1">
                <label htmlFor="travelClass" className="block text-sm font-medium text-gray-700">Class</label>
                <select
                  id="travelClass"
                  value={travelClass}
                  onChange={(e) => setTravelClass(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                >
                  <option value="economy">Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            )}

            {tripType === 'multiCity' && (
              <button
                type="button"
                onClick={addFlight}
                className="mt-4 w-full py-2 px-4 bg-gray-300 text-black rounded-md"
              >
                Add Another Flight
              </button>
            )}

            <button
              type="submit"
              className="mt-6 w-full py-2 px-4 bg-purple-600 text-white rounded-md"
            >
              Find Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};