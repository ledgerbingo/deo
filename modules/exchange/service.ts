/**
 * Exchange Service
 * 
 * Manages currency exchange operations.
 */

import { Currency, ExchangeRate, ExchangeRequest, Exchange, CurrencyPair } from './types';

export class ExchangeService {
  /**
   * Get current exchange rate between two currencies
   * 
   * @param from - Source currency
   * @param to - Target currency
   * @returns Promise resolving to exchange rate
   */
  async getExchangeRate(from: Currency, to: Currency): Promise<ExchangeRate> {
    console.log(`Fetching exchange rate: ${from} -> ${to}`);
    
    // Mock exchange rates
    const rates: Record<string, number> = {
      'USD-EUR': 0.92,
      'USD-GBP': 0.79,
      'USD-JPY': 149.50,
      'USDC-USD': 1.0,
      'EUR-USD': 1.09,
      'GBP-USD': 1.27,
    };

    const key = `${from}-${to}`;
    const rate = rates[key] || 1.0;

    return {
      from,
      to,
      rate,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get all available currency pairs
   * 
   * @returns Promise resolving to available currency pairs
   */
  async getAvailablePairs(): Promise<CurrencyPair[]> {
    console.log('Fetching available currency pairs');
    
    return [
      { from: 'USD', to: 'EUR', rate: 0.92, available: true },
      { from: 'USD', to: 'GBP', rate: 0.79, available: true },
      { from: 'USD', to: 'JPY', rate: 149.50, available: true },
      { from: 'USDC', to: 'USD', rate: 1.0, available: true },
      { from: 'EUR', to: 'USD', rate: 1.09, available: true },
      { from: 'GBP', to: 'USD', rate: 1.27, available: true },
    ];
  }

  /**
   * Execute currency exchange
   * 
   * @param request - Exchange request details
   * @returns Promise resolving to exchange result
   */
  async executeExchange(request: ExchangeRequest): Promise<Exchange> {
    console.log(`Executing exchange: ${request.amount} ${request.fromCurrency} -> ${request.toCurrency}`);
    
    const rateInfo = await this.getExchangeRate(request.fromCurrency, request.toCurrency);
    const toAmount = request.amount * rateInfo.rate;
    const fee = request.amount * 0.001; // 0.1% fee

    const exchange: Exchange = {
      id: `ex_${Date.now()}`,
      userId: request.userId,
      fromCurrency: request.fromCurrency,
      toCurrency: request.toCurrency,
      fromAmount: request.amount,
      toAmount,
      rate: rateInfo.rate,
      fee,
      status: 'pending',
      timestamp: new Date(),
    };

    // Simulate exchange completion
    setTimeout(() => {
      exchange.status = 'completed';
    }, 2000);

    return exchange;
  }

  /**
   * Get exchange history
   * 
   * @param userId - User identifier
   * @param limit - Number of exchanges to retrieve
   * @returns Promise resolving to exchange history
   */
  async getExchangeHistory(userId: string, limit: number = 20): Promise<Exchange[]> {
    console.log(`Fetching exchange history for user: ${userId}`);
    
    return [
      {
        id: 'ex_1',
        userId,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
        fromAmount: 1000,
        toAmount: 920,
        rate: 0.92,
        fee: 1.0,
        status: 'completed',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
      {
        id: 'ex_2',
        userId,
        fromCurrency: 'EUR',
        toCurrency: 'USD',
        fromAmount: 500,
        toAmount: 545,
        rate: 1.09,
        fee: 0.5,
        status: 'completed',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  /**
   * Calculate exchange preview
   * 
   * @param from - Source currency
   * @param to - Target currency
   * @param amount - Amount to exchange
   * @returns Promise resolving to exchange preview
   */
  async getExchangePreview(
    from: Currency,
    to: Currency,
    amount: number
  ): Promise<{ toAmount: number; rate: number; fee: number }> {
    console.log(`Calculating exchange preview: ${amount} ${from} -> ${to}`);
    
    const rateInfo = await this.getExchangeRate(from, to);
    const fee = amount * 0.001;
    const toAmount = amount * rateInfo.rate;

    return {
      toAmount,
      rate: rateInfo.rate,
      fee,
    };
  }
}

export const exchangeService = new ExchangeService();
