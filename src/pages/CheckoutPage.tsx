import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const CheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const flight = location.state?.flight;

  const [formData, setFormData] = useState({
    title: '',
    surname: '',
    givenName: '',
    email: '',
    phoneNumber: '',
    dateOfBirth: '',
    cardType: '',
    nameOnCard: '',
    cardNumber: '',
    expiryDate: '',
    securityCode: '',
    billingAddress: {
      line1: '',
      line2: '',
      city: '',
      postalCode: '',
      pan: '',
    },
  });

  const { itineraries, price, validatingAirlineCodes } = flight;
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

  const formatPriceToINR = (amount: number, currency: string) => {
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

  useEffect(() => {
    if (!flight) {
      navigate('/'); // Redirect to flight list if no flight details are found
    }
  }, [flight, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleBillingAddressChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const { value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      billingAddress: { ...prevData.billingAddress, [field]: value },
    }));
  };

  const handleSubmit = () => {
    // Logic for submitting the form
    alert('Booking Confirmed!');
  };

  if (!flight) return null;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Confirm Flight Details</h2>
          <p className="text-lg"><strong>Flight ID:</strong> {flight.id}</p>
          <p className="text-lg"><strong>Total Cost:</strong> {formattedPrice}</p>
        </section>

        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Mr./Ms."
              />
            </div>

            <div>
              <label htmlFor="surname" className="block text-sm font-medium text-gray-700">Surname (Last Name)</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Last Name"
              />
            </div>

            <div>
              <label htmlFor="givenName" className="block text-sm font-medium text-gray-700">Given Name (First Name)</label>
              <input
                type="text"
                id="givenName"
                name="givenName"
                value={formData.givenName}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="First Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="example@mail.com"
              />
            </div>

            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="+91 123 456 7890"
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="cardType" className="block text-sm font-medium text-gray-700">Card Type</label>
              <input
                type="text"
                id="cardType"
                name="cardType"
                value={formData.cardType}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="MasterCard, Visa, etc."
              />
            </div>

            <div>
              <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700">Name on Card</label>
              <input
                type="text"
                id="nameOnCard"
                name="nameOnCard"
                value={formData.nameOnCard}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Cardholder Name"
              />
            </div>

            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card Number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Card Number (16 digits)"
              />
            </div>

            <div>
              <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiry Date</label>
              <input
                type="text"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="MM/YY"
              />
            </div>

            <div>
              <label htmlFor="securityCode" className="block text-sm font-medium text-gray-700">Security Code (CVV)</label>
              <input
                type="text"
                id="securityCode"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="CVV"
              />
            </div>

            <div>
              <h3 className="font-medium text-lg">Billing Address</h3>
              <label htmlFor="billingAddress.line1" className="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="billingAddress.line1"
                name="billingAddress.line1"
                value={formData.billingAddress.line1}
                onChange={(e) => handleBillingAddressChange(e, 'line1')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Street Address"
              />
            </div>

            <div>
              <label htmlFor="billingAddress.line2" className="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                id="billingAddress.line2"
                name="billingAddress.line2"
                value={formData.billingAddress.line2}
                onChange={(e) => handleBillingAddressChange(e, 'line2')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Apartment, Suite, etc."
              />
            </div>

            <div>
              <label htmlFor="billingAddress.city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="billingAddress.city"
                name="billingAddress.city"
                value={formData.billingAddress.city}
                onChange={(e) => handleBillingAddressChange(e, 'city')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="City"
              />
            </div>

            <div>
              <label htmlFor="billingAddress.postalCode" className="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                id="billingAddress.postalCode"
                name="billingAddress.postalCode"
                value={formData.billingAddress.postalCode}
                onChange={(e) => handleBillingAddressChange(e, 'postalCode')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Postal Code"
              />
            </div>

            <div>
              <label htmlFor="billingAddress.pan" className="block text-sm font-medium text-gray-700">PAN</label>
              <input
                type="text"
                id="billingAddress.pan"
                name="billingAddress.pan"
                value={formData.billingAddress.pan}
                onChange={(e) => handleBillingAddressChange(e, 'pan')}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Permanent Account Number"
              />
            </div>
          </div>
        </section>

        <section className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Final Review</h2>
          <div className="text-lg">
            <p><strong>Airline:</strong> {validatingAirlineCodes.join(', ')}</p>
            <p><strong>Route:</strong> {departureSegment?.departure?.iataCode} → {arrivalSegment?.arrival?.iataCode}</p>
            <p><strong>Departure:</strong> {departureSegment ? formatTime(departureSegment.departure.at) : 'N/A'}</p>
            <p><strong>Arrival:</strong> {arrivalSegment ? formatTime(arrivalSegment.arrival.at) : 'N/A'}</p>
            <p><strong>Duration:</strong> {itineraries[0]?.duration || 'N/A'}</p>
            <p><strong>Flight Date:</strong> {new Date(departureSegment?.departure?.at).toLocaleDateString()}</p>
          </div>

          <p className="mt-4 text-lg"><strong>Flight Details:</strong> {flight.id} - {formattedPrice}</p>
          <p className="mt-2 text-sm text-gray-600"><strong>Terms & Conditions:</strong> Please review the terms regarding cancellations, baggage, and refunds.</p>

          <button
            onClick={handleSubmit}
            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300"
          >
            Confirm Booking
          </button>
        </section>
      </main>
    </div>
  );
};

export default CheckoutPage;