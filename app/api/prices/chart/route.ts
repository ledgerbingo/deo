/**
 * API Route for fetching historical chart data for assets
 */
import { NextRequest, NextResponse } from 'next/server';

// Mapping for CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol');
  const period = searchParams.get('period') || '7'; // days

  if (!symbol) {
    return NextResponse.json({ error: 'No symbol provided' }, { status: 400 });
  }

  try {
    const upperSymbol = symbol.toUpperCase();
    
    // Check if it's a crypto asset
    if (COINGECKO_IDS[upperSymbol]) {
      const coinId = COINGECKO_IDS[upperSymbol];
      
      try {
        // Try to fetch historical data from CoinGecko
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${period}`,
          {
            headers: {
              'Accept': 'application/json',
            },
            next: { revalidate: 300 }, // Cache for 5 minutes
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Transform the data to a simpler format
          const chartData = data.prices.map((point: [number, number]) => ({
            timestamp: point[0],
            date: new Date(point[0]).toISOString(),
            price: point[1],
          }));

          return NextResponse.json({ 
            symbol: upperSymbol,
            period,
            data: chartData,
          });
        }
      } catch (error) {
        console.log('CoinGecko API unavailable, using fallback data for crypto');
      }
      
      // Fallback for crypto if API fails
      const basePrice = getBasePriceForSymbol(upperSymbol);
      const days = parseInt(period);
      const chartData = generateMockChartData(basePrice, days);
      
      return NextResponse.json({
        symbol: upperSymbol,
        period,
        data: chartData,
      });
    } else {
      // For stocks/ETFs/bonds, generate realistic mock data
      const basePrice = getBasePriceForSymbol(upperSymbol);
      const days = parseInt(period);
      const chartData = generateMockChartData(basePrice, days);
      
      return NextResponse.json({
        symbol: upperSymbol,
        period,
        data: chartData,
      });
    }
  } catch (error) {
    console.error('Error fetching chart data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch chart data' },
      { status: 500 }
    );
  }
}

function getBasePriceForSymbol(symbol: string): number {
  const prices: Record<string, number> = {
    'BTC': 96327.12,
    'ETH': 3500,
    'SOL': 150,
    'AAPL': 178.50,
    'GOOGL': 140.35,
    'MSFT': 380.75,
    'SPY': 470.20,
    'QQQ': 390.45,
    'VTI': 240.10,
    'AGG': 95.30,
    'BND': 72.15,
    'TLT': 90.80,
  };
  return prices[symbol] || 100;
}

function generateMockChartData(basePrice: number, days: number) {
  const data = [];
  const now = Date.now();
  const interval = (24 * 60 * 60 * 1000) / (days <= 1 ? 24 : days); // hourly for 1 day, daily otherwise
  const points = days <= 1 ? 24 : days;
  
  let price = basePrice * 0.95; // Start slightly lower
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - ((points - i) * interval);
    
    // Add realistic price movement
    const change = (Math.random() - 0.48) * (basePrice * 0.02); // Slight upward bias
    price = Math.max(price + change, basePrice * 0.85); // Don't go too low
    price = Math.min(price, basePrice * 1.15); // Don't go too high
    
    data.push({
      timestamp,
      date: new Date(timestamp).toISOString(),
      price: Math.round(price * 100) / 100,
    });
  }
  
  return data;
}
