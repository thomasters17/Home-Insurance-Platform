import { z } from 'zod';
import { ProductQuestions } from '../types/question.types';

export function buildProductAnswersSchema(
  questions: ProductQuestions,
  baseSchema: z.ZodObject<any>
): z.ZodObject<any> {
  const shape: Record<string, z.ZodTypeAny> = {};

  questions.questions.forEach((question) => {
    const baseField = baseSchema.shape[question.key];
    if (baseField) {
      shape[question.key] = question.isRequired ? baseField : baseField.optional();
    }
  });

  return z.object(shape);
}