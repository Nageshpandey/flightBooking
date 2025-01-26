
export const formatPriceToINR = (amount: number, currency: string) => {
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
  
  export const formatPrice = (price: number) => {
    return `₹${price.toLocaleString('en-IN')}`;
  };
  