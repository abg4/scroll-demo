export function prettyAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Function to scale the input amount by 6 decimal places
export const scaleUsdc = (inputAmount: string): number => {
  const parsedAmount = parseFloat(inputAmount);
  if (isNaN(parsedAmount)) return 0;
  return Math.floor(parsedAmount * 1_000_000);
};

// Function to convert raw amount to pretty format (6 decimal places)
export const prettyUsdc = (rawAmount: number | string, decimals: number = 6): string => {
  const amount = typeof rawAmount === 'string' ? parseInt(rawAmount, 10) : rawAmount;
  if (isNaN(amount)) return '0';
  return (amount / 1_000_000).toFixed(decimals);
};

export const prettyAaveValue = (rawAmount: number | string, decimals: number = 2): string => {
  const amount = typeof rawAmount === 'string' ? parseInt(rawAmount, 10) : rawAmount;
  if (isNaN(amount)) return '0';
  return (amount / 100_000_000).toFixed(decimals);
};
