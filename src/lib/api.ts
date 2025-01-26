import axios from 'axios';
import { fetchAccessToken } from './auth';
import { FlightOffer } from '../types';
import { FlightSearchParams } from '../types'; // Adjust the path as necessary

export const fetchAirports = async (query: string): Promise<{ iataCode: string; name: string; city: string }[]> => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: {
        Accept: 'application/vnd.amadeus+json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        keyword: query,
        subType: 'AIRPORT',
        'page[limit]': 50,
      },
    });

    return response.data.data.map((item: any) => ({
      iataCode: item.iataCode,
      name: item.name,
      city: item.address.cityName || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching airports:', error);
    throw new Error('Failed to fetch airports');
  }
};

export const fetchCities = async (query: string): Promise<{ name: string }[]> => {
  try {
    const accessToken = await fetchAccessToken();

    const response = await axios.get('https://test.api.amadeus.com/v1/reference-data/locations', {
      headers: {
        Accept: 'application/vnd.amadeus+json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        keyword: query,
        subType: 'CITY',
        'page[limit]': 30,
      },
    });

    return response.data.data.map((item: any) => ({
      name: item.name,
    }));
  } catch (error) {
    console.error('Error fetching cities:', error);
    throw new Error('Failed to fetch cities');
  }
};

export const fetchFlights = async (params: FlightSearchParams): Promise<{ offers: FlightOffer[], carriers: { [key: string]: string } }> => {
  try {
    const accessToken = await fetchAccessToken();

    const { originLocationCode, destinationLocationCode, departureDate, adults, children, nonStop } = params;
    const response = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      headers: {
        Accept: 'application/vnd.amadeus+json',
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        adults,
        children,
        nonStop,
        max: 250,
      },
    });

    return {
      offers: response.data.data,
      carriers: response.data.dictionaries.carriers
    };
  } catch (error) {
    console.error('Error fetching flights:', error);
    throw new Error('Failed to fetch flights');
  }
};
