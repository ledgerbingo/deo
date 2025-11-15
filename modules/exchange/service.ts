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
    
    // Mock exchange rates for Circle StableFX stablecoins
    // In production, these would come from Circle StableFX API
    const rates: Record<string, number> = {
      // USDC pairs
      'USDC-EURC': 0.92,
      'USDC-AUDF': 1.52,
      'USDC-BRLA': 5.71,
      'USDC-JPYC': 149.50,
      'USDC-KRW1': 1320.50,
      'USDC-MXNB': 17.25,
      'USDC-PHPC': 56.50,
      'USDC-QCAD': 1.36,
      'USDC-ZARU': 18.95,
      
      // EURC pairs
      'EURC-USDC': 1.09,
      'EURC-AUDF': 1.65,
      'EURC-BRLA': 6.21,
      'EURC-JPYC': 163.04,
      'EURC-KRW1': 1436.50,
      'EURC-MXNB': 18.78,
      'EURC-PHPC': 61.52,
      'EURC-QCAD': 1.48,
      'EURC-ZARU': 20.63,
      
      // Other pairs (reverse of above)
      'AUDF-USDC': 0.66,
      'BRLA-USDC': 0.18,
      'JPYC-USDC': 0.0067,
      'KRW1-USDC': 0.00076,
      'MXNB-USDC': 0.058,
      'PHPC-USDC': 0.018,
      'QCAD-USDC': 0.74,
      'ZARU-USDC': 0.053,
      
      'AUDF-EURC': 0.61,
      'BRLA-EURC': 0.16,
      'JPYC-EURC': 0.0061,
      'KRW1-EURC': 0.00070,
      'MXNB-EURC': 0.053,
      'PHPC-EURC': 0.016,
      'QCAD-EURC': 0.68,
      'ZARU-EURC': 0.048,
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
