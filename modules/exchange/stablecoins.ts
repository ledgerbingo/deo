/**
 * Circle StableFX Supported Stablecoins
 * 
 * Data for all stablecoins supported by Circle StableFX
 */

import type { StablecoinInfo, Currency } from './types';

export const STABLECOINS: Record<Currency, StablecoinInfo> = {
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    issuer: 'Circle',
    country: 'United States',
    countryCode: 'US',
    fiatCurrency: 'US Dollar',
    fiatSymbol: 'USD',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b5a_usdc.svg',
  },
  EURC: {
    symbol: 'EURC',
    name: 'Euro Coin',
    issuer: 'Circle',
    country: 'European Economic Area',
    countryCode: 'EU',
    fiatCurrency: 'Euro',
    fiatSymbol: 'EUR',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b5c_eurc.svg',
  },
  AUDF: {
    symbol: 'AUDF',
    name: 'Australian Dollar Forte',
    issuer: 'Forte',
    country: 'Australia',
    countryCode: 'AU',
    fiatCurrency: 'Australian Dollar',
    fiatSymbol: 'AUD',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b5b_forte.svg',
  },
  BRLA: {
    symbol: 'BRLA',
    name: 'Brazilian Real Asset',
    issuer: 'Avenia',
    country: 'Brazil',
    countryCode: 'BR',
    fiatCurrency: 'Brazilian Real',
    fiatSymbol: 'BRL',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b59_brla.svg',
  },
  JPYC: {
    symbol: 'JPYC',
    name: 'JPY Coin',
    issuer: 'JPYC Inc.',
    country: 'Japan',
    countryCode: 'JP',
    fiatCurrency: 'Japanese Yen',
    fiatSymbol: 'JPY',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b5e_jpyc.svg',
  },
  KRW1: {
    symbol: 'KRW1',
    name: 'Korean Won 1',
    issuer: 'BDACS',
    country: 'South Korea',
    countryCode: 'KR',
    fiatCurrency: 'South Korean Won',
    fiatSymbol: 'KRW',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b5f_krw1.svg',
  },
  MXNB: {
    symbol: 'MXNB',
    name: 'Mexican Peso Bitso',
    issuer: 'Bitso',
    country: 'Mexico',
    countryCode: 'MX',
    fiatCurrency: 'Mexican Peso',
    fiatSymbol: 'MXN',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b60_mxnb.svg',
  },
  PHPC: {
    symbol: 'PHPC',
    name: 'Philippine Peso Coin',
    issuer: 'Coins.PH',
    country: 'Philippines',
    countryCode: 'PH',
    fiatCurrency: 'Philippine Peso',
    fiatSymbol: 'PHP',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b61_phpc.svg',
  },
  QCAD: {
    symbol: 'QCAD',
    name: 'QCAD Stablecoin',
    issuer: 'Stablecorp',
    country: 'Canada',
    countryCode: 'CA',
    fiatCurrency: 'Canadian Dollar',
    fiatSymbol: 'CAD',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b62_qcad.svg',
  },
  ZARU: {
    symbol: 'ZARU',
    name: 'South African Rand Universal',
    issuer: 'ZAR Universal Network',
    country: 'South Africa',
    countryCode: 'ZA',
    fiatCurrency: 'South African Rand',
    fiatSymbol: 'ZAR',
    icon: 'https://cdn.prod.website-files.com/67116d0daddc92483c812e88/690e326269c046ed0c3b2b63_zaru.svg',
  },
};

export const CURRENCY_LIST: Currency[] = Object.keys(STABLECOINS) as Currency[];

export function getStablecoinInfo(currency: Currency): StablecoinInfo {
  return STABLECOINS[currency];
}
