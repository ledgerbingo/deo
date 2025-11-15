/**
 * Exchange Service
 * 
 * Manages currency exchange operations for Circle StableFX stablecoins.
 */

import { Currency, ExchangeRate, ExchangeRequest, Exchange, CurrencyPair } from './types';
import { STABLECOINS } from './stablecoins';

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
    
    // If from and to are the same, return 1.0
    if (from === to) {
      return {
        from,
        to,
        rate: 1.0,
        lastUpdated: new Date(),
      };
    }
    
    // Base exchange rates from USDC to all other currencies
    // In production, these would come from Circle StableFX API
    const usdcRates: Record<Currency, number> = {
      USDC: 1.0,
      EURC: 0.92,
      AUDF: 1.52,
      BRLA: 5.71,
      JPYC: 149.50,
      KRW1: 1320.50,
      MXNB: 17.25,
      PHPC: 56.50,
      QCAD: 1.36,
      ZARU: 18.95,
    };

    // Calculate exchange rate using USDC as the base currency
    // Rate from A to B = (1 / rate_USDC_to_A) * rate_USDC_to_B
    const fromRate = usdcRates[from];
    const toRate = usdcRates[to];
    const rate = toRate / fromRate;

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
    
    // All Circle StableFX stablecoins can be exchanged with each other
    const pairs: CurrencyPair[] = [];
    const currencies = Object.keys(STABLECOINS) as Currency[];
    
    for (const from of currencies) {
      for (const to of currencies) {
        if (from !== to) {
          const rate = await this.getExchangeRate(from, to);
          pairs.push({ from, to, rate: rate.rate, available: true });
        }
      }
    }
    
    return pairs;
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
    
    // Mock exchange history with Circle StableFX stablecoins
    return [
      {
        id: 'ex_1',
        userId,
        fromCurrency: 'USDC',
        toCurrency: 'EURC',
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
        fromCurrency: 'EURC',
        toCurrency: 'USDC',
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
