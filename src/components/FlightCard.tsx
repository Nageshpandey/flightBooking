import React from 'react';
import { FlightOffer } from '../types';
import { useNavigate } from 'react-router-dom';

type FlightCardProps = {
  flight: FlightOffer;
  carriers: { [key: string]: string };
  isReturn?: boolean; // To identify if it's the return flight
};

export const FlightCard: React.FC<FlightCardProps> = ({ flight, carriers, isReturn = false }) => {
  const navigate = useNavigate();
  const { itineraries, price, validatingAirlineCodes } = flight;

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formatPriceToINR = (amount: number, currency:  string) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }

    const conversionRates: { [key: string]: number } = {
      USD: 83.0,
      EUR: 90.0,
      GBP: 103.0,
    };

    const convertedAmount = conversionRates[currency]
      ? amount * conversionRates[currency]
      : amount;

    return `₹${convertedAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
  };

  const formattedPrice = formatPriceToINR(parseFloat(price.total.toString()), price.currency);

  const departureSegment = itineraries[0].segments[0];
  const arrivalSegment = itineraries[0].segments.slice(-1)[0];

  const handleFlightClick = () => {
    navigate('/review-trip', { state: { flight, isReturn, adults: flight.adults, children: flight.children } });
  };

  return (
    <div
      className="bg-white shadow-sm p-4 rounded-lg cursor-pointer"
      onClick={handleFlightClick}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold">From: {departureSegment.departure.iataCode}</h3>
          <p>
            <strong>Departure:</strong> {formatTime(departureSegment.departure.at)} (Terminal: {departureSegment.departure.terminal || 'N/A'})
          </p>
        </div>
        <div>
          <h3 className="text-lg font-bold">To: {arrivalSegment.arrival.iataCode}</h3>
          <p>
            <strong>Arrival:</strong> {formatTime(arrivalSegment.arrival.at)} (Terminal: {arrivalSegment.arrival.terminal || 'N/A'})
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-sm text-gray-700">
          Airline: {validatingAirlineCodes.map(code => carriers[code] || code).join(', ') || 'N/A'}
        </p>
        <p className="text-xl font-bold text-green-600">
          {formattedPrice}
        </p>
      </div>
    </div>
  );
};