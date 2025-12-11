/**
 * Form-specific types for state management and validation
 */

import { ProductAnswers, Policyholder, Property, ProductType } from './policy.types';

/**
 * Form field error structure
 */
export interface FieldError {
  field: string;
  message: string;
}

/**
 * Complete form state
 * Matches the three sections of the form: policyholder, property, product questions
 */
export interface FormState {
  policyholder: Partial<Policyholder>;
  property: Partial<Property>;
  productAnswers: Partial<ProductAnswers>;
}

/**
 * Form submission data (all fields required)
 */
export interface FormSubmitData {
  productType: ProductType;
  policyholder: Policyholder;
  property: Property;
  productAnswers: ProductAnswers;
}
