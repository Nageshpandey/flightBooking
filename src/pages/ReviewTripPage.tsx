import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReviewTripPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  // Redirect back if no flight details are found
  if (!flight) {
    return <div>No flight details found. Please select a flight first.</div>;
  }

  // Extract flight details
  const { itineraries, price, validatingAirlineCodes, travelerPricings } = flight;

  const departureSegment = itineraries[0]?.segments[0];
  const arrivalSegment = itineraries[0]?.segments.slice(-1)[0];

  const formatTime = (time: string) => {
    const date = new Date(time);
    return date.toLocaleString('en-IN', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  // Function to convert to INR
  const formatPriceToINR = (amount: number, currency: string) => {
    if (currency === 'INR') {
      return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;
    }

    // Conversion rates (example values, ensure they are accurate)
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

  const totalCost = parseFloat(price?.total || '0');
  const baseCost = parseFloat(price?.base || '0');
  const fees = parseFloat(price?.fees?.[0]?.amount || '0');
  const currency = price?.currency || 'INR';

  // Calculate formatted prices
  const formattedBaseCost = formatPriceToINR(baseCost, currency);
  const formattedFees = formatPriceToINR(fees, currency);
  const formattedTotalCost = formatPriceToINR(totalCost, currency);

  // Extract amenities from travelerPricing
  const flightAmenities = travelerPricings[0]?.fareDetailsBySegment[0]?.amenities || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Review Your Trip</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-12 gap-6">
        <section className="col-span-12 md:col-span-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold">Flight Details</h2>

          <div className="space-y-4 mt-4">
            {/* Flight Information */}
            <div>
              <p><strong>Airline:</strong> {validatingAirlineCodes.join(', ')}</p>
              <p><strong>Route:</strong> {departureSegment?.departure?.iataCode} → {arrivalSegment?.arrival?.iataCode}</p>
              <p><strong>Departure:</strong> {departureSegment ? formatTime(departureSegment.departure.at) : 'N/A'}</p>
              <p><strong>Arrival:</strong> {arrivalSegment ? formatTime(arrivalSegment.arrival.at) : 'N/A'}</p>
              <p><strong>Duration:</strong> {itineraries[0]?.duration || 'N/A'}</p>
              <p><strong>Flight Date:</strong> {new Date(departureSegment?.departure?.at).toLocaleDateString()}</p>
            </div>

            {/* Fare Breakdown */}
            <div>
              <h3 className="text-lg font-bold">Fare Breakdown</h3>
              <p><strong>Flight Cost:</strong> {formattedBaseCost}</p>
              <p><strong>Taxes & Fees:</strong> {formattedFees}</p>
              <p><strong>Total per Traveler:</strong> {formattedTotalCost}</p>
              <p><strong>Total Trip Cost:</strong> {formattedTotalCost}</p>
            </div>

            {/* Flight Amenities */}
            <div>
              <h3 className="text-lg font-bold">Flight Amenities</h3>
              {flightAmenities.length > 0 ? (
                <ul className="list-disc ml-6">
                  {flightAmenities.map((amenity: any, index: number) => (
                    <li key={index}>
                      <p>
                        <strong>{amenity.amenityType}:</strong> {amenity.description}
                        {amenity.isChargeable && <span> (Chargeable)</span>}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No amenities available for this flight.</p>
              )}
            </div>

            {/* Actions */}
            <div className="mt-4 space-x-4">
              <button
                onClick={() => navigate('/flights')}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Change Flight
              </button>
              <button
                onClick={() =>
                  navigate('/checkout', { state: { flight, travelerPricings } })
                }
                className="bg-green-500 text-white px-4 py-2 rounded-md"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ReviewTripPage;
