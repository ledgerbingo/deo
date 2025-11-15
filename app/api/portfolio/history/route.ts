/**
 * API Route for fetching portfolio historical performance data
 */
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const userId = searchParams.get('userId');
  const period = searchParams.get('period') || '30'; // days

  if (!userId) {
    return NextResponse.json({ error: 'No userId provided' }, { status: 400 });
  }

  try {
    // Generate realistic portfolio historical data
    const days = parseInt(period);
    const chartData = generatePortfolioHistory(days);
    
    return NextResponse.json({
      userId,
      period,
      data: chartData,
    });
  } catch (error) {
    console.error('Error fetching portfolio history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio history' },
      { status: 500 }
    );
  }
}

function generatePortfolioHistory(days: number) {
  const data = [];
  const now = Date.now();
  const interval = (24 * 60 * 60 * 1000); // daily data
  const points = days;
  
  // Base portfolio value - roughly matching the initial holdings value
  const currentValue = 55163.56; // Current BTC + ETH holdings value
  const baseValue = currentValue / 1.02; // Start slightly lower to show growth
  
  let value = baseValue;
  
  for (let i = 0; i < points; i++) {
    const timestamp = now - ((points - i) * interval);
    
    // Add realistic portfolio value movement
    // Simulate market volatility with slight upward trend
    const dailyChange = (Math.random() - 0.48) * (baseValue * 0.03); // Slight upward bias
    value = Math.max(value + dailyChange, baseValue * 0.85); // Don't drop too low
    value = Math.min(value, currentValue * 1.05); // Cap at reasonable high
    
    // Ensure we end close to current value
    if (i === points - 1) {
      value = currentValue;
    }
    
    data.push({
      timestamp,
      date: new Date(timestamp).toISOString(),
      value: Math.round(value * 100) / 100,
    });
  }
  
  return data;
}
