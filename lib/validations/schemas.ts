/**
 * Zod validation schemas for runtime type checking and validation
 */
import { z } from 'zod';
import {formatPostcode, isMinimumAge, validatePostcode} from "@/lib/validations/validators";

/**
 * Policyholder validation schema
 */
export const policyholderSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'First name can only contain letters, spaces, hyphens and apostrophes'),

  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must not exceed 50 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Last name can only contain letters, spaces, hyphens and apostrophes'),

  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required')
    .refine(
      (date) => {
        const parsed = new Date(date);
        return !isNaN(parsed.getTime());
      },
      { message: 'Invalid date format' }
    )
    .refine(isMinimumAge, 'Policyholder must be 18 or over')
});

/**
 * Property validation schema
 */
export const propertySchema = z.object({
  addressLine1: z
    .string()
    .min(1, 'Address line 1 is required')
    .max(100, 'Address line 1 must not exceed 100 characters'),

  addressLine2: z
    .string()
    .max(100, 'Address line 2 must not exceed 100 characters')
    .optional(),

  addressLine3: z
    .string()
    .max(100, 'Address line 3 must not exceed 100 characters')
    .optional(),

  postcode: z
    .string()
    .min(1, 'Postcode is required')
    .max(8, 'Postcode must not exceed 8 characters')
    .refine(validatePostcode, 'Invalid UK postcode format')
    .transform(formatPostcode) // Auto-format on submission
});

/**
 * Household product answers schema
 */
export const householdAnswersSchema = z.object({
  propertyType: z.enum([
    'TerracedHouse',
    'DetachedHouse',
    'SemiDetachedHouse',
    'TerracedBungalow',
  ], { error: 'Property type is required' }),

  numberOfBedrooms: z
    .number({ error: 'Number of bedrooms is required' })
    .int('Number of bedrooms must be a whole number')
    .min(1, 'Must have at least 1 bedroom')
    .max(6, 'Maximum 6 bedrooms allowed'),

  yearOfConstruction: z
    .number({ error: 'Year of construction is required' })
    .int('Year must be a whole number')
    .min(1700, 'Year must be 1700 or later')
    .max(2000, 'Year must be 2000 or earlier'),
});

/**
 * Buy to Let product answers schema
 */
export const buyToLetAnswersSchema = z.object({
  propertyType: z.enum([
    'TerracedHouse',
    'DetachedHouse',
    'SemiDetachedHouse',
    'TerracedBungalow',
  ], { error: 'Property type is required' }),

  numberOfBedrooms: z
    .number({ error: 'Number of bedrooms is required' })
    .int('Number of bedrooms must be a whole number')
    .min(1, 'Must have at least 1 bedroom')
    .max(6, 'Maximum 6 bedrooms allowed'),

  isPropertyLetToStudents: z
    .boolean({ error: 'Please specify if property is let to students' }),
});

/**
 * Complete policy schema
 * Used for validating the entire form before submission
 */
export const createPolicySchema = z.object({
  productType: z.enum(['household', 'buyToLet']),
  policyholder: policyholderSchema,
  property: propertySchema,
  productAnswers: z.union([householdAnswersSchema, buyToLetAnswersSchema]),
});

/**
 * Helper function to validate form data
 * Returns typed validation result
 */
export function validateFormData(data: unknown, productType: 'household' | 'buyToLet') {
  const schema = createPolicySchema.extend({
    productAnswers: productType === 'household'
      ? householdAnswersSchema
      : buyToLetAnswersSchema,
  });

  return schema.safeParse(data);
}