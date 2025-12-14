import { z } from 'zod';
import { ProductQuestions } from '../types/question.types';

export function buildProductAnswersSchema(
  questions: ProductQuestions,
  baseSchema: z.ZodObject<any>
): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  questions.questions.forEach((question) => {
    const baseField = baseSchema.shape?.[question.key];
    if (baseField) {
      shape[question.key] = question.isRequired ? baseField : baseField.optional();
    } else {
      // Warn when a question key in JSON has no corresponding base schema mapping
      if (typeof console !== 'undefined' && console.warn) {
        console.warn(
          `[schemaBuilder] No base schema found for field "${question.key}" in product "${questions.productType}". ` +
          'The field will not be validated unless a base schema is added.'
        );
      }
    }
  });

  return z.object(shape);
}