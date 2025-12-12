import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PRODUCT_TYPES } from '@/lib/utils/constants';
import {questionService} from "@/lib/services/questionService";

vi.mock('@/data/questions/household.json', () => ({
  default: {
    productType: 'household',
    version: '1.0.0',
    lastUpdated: '2024-01-01',
    questions: [
      { key: 'q1', displayText: 'Question 1', type: 'Text', isRequired: true, answer: null },
    ],
  },
}));

vi.mock('@/data/questions/buytolet.json', () => ({
  default: {
    productType: 'buyToLet',
    version: '1.0.0',
    lastUpdated: '2024-01-01',
    questions: [
      { key: 'q2', displayText: 'Question 2', type: 'Number', isRequired: true, answer: null },
    ],
  },
}));

describe('QuestionService', () => {
  beforeEach(() => {
    questionService.clearCache();
  });

  it('loads household questions', async () => {
    const result = await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);

    expect(result.productType).toBe('household');
    expect(result.questions[0].key).toBe('q1');
  });

  it('loads buy-to-let questions', async () => {
    const result = await questionService.getQuestions(PRODUCT_TYPES.BUY_TO_LET);

    expect(result.productType).toBe('buyToLet');
    expect(result.questions[0].key).toBe('q2');
  });

  it('caches loaded questions', async () => {
    const spy = vi.spyOn(questionService, 'validateQuestionStructure' as any);

    await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);
    await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('throws for unknown product type', async () => {
    // @ts-expect-error intentional
    await expect(questionService.getQuestions('invalid')).rejects.toThrow(
      'Unknown product type: invalid',
    );
  });

  it('preloadAll caches both configs', async () => {
    await expect(questionService.preloadAll()).resolves.not.toThrow();

    // @ts-expect-error: ok for tests
    expect(questionService.cache.size).toBe(2);
  });
});
