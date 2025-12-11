/**
 * Application-wide constants
 */
export const APP_NAME = 'Uinsure';

export const PRODUCT_TYPES = {
  HOUSEHOLD: 'household',
  BUY_TO_LET: 'buyToLet',
} as const;

export const PROPERTY_TYPES = {
  TERRACED_HOUSE: 'TerracedHouse',
  DETACHED_HOUSE: 'DetachedHouse',
  SEMI_DETACHED_HOUSE: 'SemiDetachedHouse',
  TERRACED_BUNGALOW: 'TerracedBungalow',
} as const;

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  POLICIES: '/policies',
  QUOTE_HOUSEHOLD: '/quote/household',
  QUOTE_BUY_TO_LET: '/quote/buyToLet',
} as const;