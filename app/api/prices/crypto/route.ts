/**
 * API Route for fetching real-time cryptocurrency prices from CoinGecko
 */
import { NextRequest, NextResponse } from 'next/server';

// Mapping of our symbols to CoinGecko IDs
const COINGECKO_IDS: Record<string, string> = {
  'BTC': 'bitcoin',
  'ETH': 'ethereum',
  'SOL': 'solana',
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbols = searchParams.get('symbols')?.split(',') || [];

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 });
  }

  try {
    // Map symbols to CoinGecko IDs
    const coinIds = symbols
      .map(symbol => COINGECKO_IDS[symbol.toUpperCase()])
      .filter(Boolean)
      .join(',');

    if (!coinIds) {
      return NextResponse.json({ error: 'No valid crypto symbols provided' }, { status: 400 });
    }

    // Fetch from CoinGecko API (no API key required for basic usage)
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds}&vs_currencies=usd&include_24hr_change=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 30 }, // Cache for 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the data to match our format
    const prices: Record<string, { price: number; change24h: number }> = {};
    
    for (const [symbol, coinId] of Object.entries(COINGECKO_IDS)) {
      if (data[coinId]) {
        prices[symbol] = {
          price: data[coinId].usd,
          change24h: data[coinId].usd_24h_change || 0,
        };
      }
    }

    return NextResponse.json({ prices });
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cryptocurrency prices' },
      { status: 500 }
    );
  }
}
