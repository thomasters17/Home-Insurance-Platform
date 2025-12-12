import { ProductAnswers, Policyholder, Property, ProductType } from './policy.types';

/**
 * Complete form data structure
 * This is what React Hook Form will manage
 */
export interface PolicyFormData {
  productType: ProductType;
  policyholder: Policyholder;
  property: Property;
  productAnswers: ProductAnswers;
}

/**
 * Form submission data (same as above but more explicit)
 */
export type FormSubmitData = PolicyFormData;

/**
 * This creates a union type of all valid productAnswers paths
 * like "productAnswers.propertyType" | "productAnswers.numberOfBedrooms" etc.
 *
 * However, since our questions are loaded dynamically from JSON, we can't
 * know all possible keys at compile time. So we use this as a base and allow
 * extension with template literal types.
 */
export type ProductAnswersPath = `productAnswers.${string}`;

/**
 * Type guard to check if a path is a productAnswers path
 */
export function isProductAnswersPath(path: string): path is ProductAnswersPath {
  return path.startsWith('productAnswers.');
}