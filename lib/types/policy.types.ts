/**
 * Core policy data types
 * These represent the actual data stored for each insurance policy
 */

export type ProductType = 'household' | 'buyToLet';

/**
 * Property types available for both insurance products
 */
export type PropertyType =
  | 'TerracedHouse'
  | 'DetachedHouse'
  | 'SemiDetachedHouse'
  | 'TerracedBungalow';

/**
 * Policyholder personal information
 */
export interface Policyholder {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO 8601 format (YYYY-MM-DD)
}

/**
 * Property address information
 */
export interface Property {
  addressLine1: string;
  addressLine2?: string;
  addressLine3?: string;
  postcode: string;
}

/**
 * Product-specific answers for Household insurance
 */
export interface HouseholdAnswers {
  propertyType: PropertyType;
  numberOfBedrooms: number; // 1-6
  yearOfConstruction: number; // 1700-2000 (represented by bracket value)
}

/**
 * Product-specific answers for Buy to Let insurance
 */
export interface BuyToLetAnswers {
  propertyType: PropertyType;
  numberOfBedrooms: number; // 1-6
  isPropertyLetToStudents: boolean;
}

/**
 * Generic product answers type
 * Allows either Household or BuyToLet specific answers
 */
export type ProductAnswers = Record<string, any>;
/**
 * Complete policy data structure
 * This is what gets stored when a user submits the form
 */
export interface Policy<T extends ProductAnswers = ProductAnswers> {
  id: string; // UUID v4
  productType: ProductType;
  policyholder: Policyholder;
  property: Property;
  productAnswers: T;
  createdAt: string; // ISO 8601 timestamp
}

/**
 * Type-safe policy creation (without id and createdAt)
 */
export type CreatePolicyInput<T extends ProductAnswers = ProductAnswers> = Omit<
  Policy<T>,
  'id' | 'createdAt'
>;

/**
 * Type guard to check if policy is Household
 */
export function isHouseholdPolicy(policy: Policy): policy is Policy<HouseholdAnswers> {
  return policy.productType === 'household';
}

/**
 * Type guard to check if policy is Buy to Let
 */
export function isBuyToLetPolicy(policy: Policy): policy is Policy<BuyToLetAnswers> {
  return policy.productType === 'buyToLet';
}