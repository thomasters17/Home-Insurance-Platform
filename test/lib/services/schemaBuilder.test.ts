import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { buildProductAnswersSchema } from '@/lib/services/schemaBuilder';
import type { ProductQuestions } from '@/lib/types/question.types';

describe('buildProductAnswersSchema', () => {
  const baseSchema = z.object({
    propertyType: z.string().min(1, 'Property type is required'),
    numberOfBedrooms: z.number().min(1).max(6),
    yearOfConstruction: z.number().min(1700).max(2000),
  });

  describe('isRequired handling', () => {
    it('should keep field required when isRequired is true', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'propertyType',
            displayText: 'Property Type',
            type: 'Choice',
            isRequired: true,
            answer: {
              type: 'String',
              values: [{ label: 'House', value: 'house' }],
            },
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should fail validation when field is missing
      const result = schema.safeParse({});
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues).toHaveLength(1);
        expect(result.error.issues[0].path).toEqual(['propertyType']);
      }
    });

    it('should make field optional when isRequired is false', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'propertyType',
            displayText: 'Property Type',
            type: 'Choice',
            isRequired: false,
            answer: {
              type: 'String',
              values: [{ label: 'House', value: 'house' }],
            },
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should pass validation when field is missing
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('validation preservation', () => {
    it('should preserve validation rules from base schema', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'numberOfBedrooms',
            displayText: 'Number of Bedrooms',
            type: 'Number',
            isRequired: true,
            answer: null,
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should fail when value is below minimum
      const resultTooLow = schema.safeParse({ numberOfBedrooms: 0 });
      expect(resultTooLow.success).toBe(false);

      // Should fail when value is above maximum
      const resultTooHigh = schema.safeParse({ numberOfBedrooms: 7 });
      expect(resultTooHigh.success).toBe(false);

      // Should pass with valid value
      const resultValid = schema.safeParse({ numberOfBedrooms: 3 });
      expect(resultValid.success).toBe(true);
    });

    it('should preserve string validation rules', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'propertyType',
            displayText: 'Property Type',
            type: 'Choice',
            isRequired: true,
            answer: {
              type: 'String',
              values: [],
            },
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should fail with empty string
      const result = schema.safeParse({ propertyType: '' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toBe('Property type is required');
      }
    });
  });

  describe('multiple fields', () => {
    it('should handle multiple fields with mixed required/optional', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'propertyType',
            displayText: 'Property Type',
            type: 'Choice',
            isRequired: true,
            answer: { type: 'String', values: [] },
          },
          {
            key: 'numberOfBedrooms',
            displayText: 'Number of Bedrooms',
            type: 'Number',
            isRequired: false,
            answer: null,
          },
          {
            key: 'yearOfConstruction',
            displayText: 'Year',
            type: 'Number',
            isRequired: true,
            answer: null,
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should fail without required fields
      const resultMissingRequired = schema.safeParse({});
      expect(resultMissingRequired.success).toBe(false);

      // Should pass with only required fields
      const resultOnlyRequired = schema.safeParse({
        propertyType: 'house',
        yearOfConstruction: 1900,
      });
      expect(resultOnlyRequired.success).toBe(true);

      // Should pass with all fields
      const resultAll = schema.safeParse({
        propertyType: 'house',
        numberOfBedrooms: 3,
        yearOfConstruction: 1900,
      });
      expect(resultAll.success).toBe(true);
    });
  });

  describe('edge cases', () => {
    it('should handle empty questions array', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should create empty object schema
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should ignore fields not in base schema', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'nonExistentField',
            displayText: 'Does Not Exist',
            type: 'Text',
            isRequired: true,
            answer: null,
          },
          {
            key: 'propertyType',
            displayText: 'Property Type',
            type: 'Choice',
            isRequired: true,
            answer: { type: 'String', values: [] },
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should only validate propertyType
      const result = schema.safeParse({ propertyType: 'house' });
      expect(result.success).toBe(true);
    });

    it('should handle all fields being optional', () => {
      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'propertyType',
            displayText: 'Property Type',
            type: 'Choice',
            isRequired: false,
            answer: { type: 'String', values: [] },
          },
          {
            key: 'numberOfBedrooms',
            displayText: 'Bedrooms',
            type: 'Number',
            isRequired: false,
            answer: null,
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, baseSchema);

      // Should pass with empty object
      const result = schema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('type coercion', () => {
    it('should preserve type coercion from base schema', () => {
      const coerceSchema = z.object({
        numberOfBedrooms: z.coerce.number().min(1).max(6),
      });

      const questions: ProductQuestions = {
        productType: 'household',
        version: '1.0.0',
        lastUpdated: '2024-12-10',
        questions: [
          {
            key: 'numberOfBedrooms',
            displayText: 'Bedrooms',
            type: 'Number',
            isRequired: true,
            answer: null,
          },
        ],
      };

      const schema = buildProductAnswersSchema(questions, coerceSchema);

      // Should coerce string to number
      const result = schema.safeParse({ numberOfBedrooms: '3' });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.numberOfBedrooms).toBe(3);
        expect(typeof result.data.numberOfBedrooms).toBe('number');
      }
    });
  });
});