import { describe, it, expect, beforeEach, vi } from 'vitest';
import {questionService} from "@/lib/services/questionService";
import {PRODUCT_TYPES} from "@/lib/utils/constants";
import {ProductQuestions} from "@/lib/types/question.types";

describe('QuestionService', () => {
  const mockHouseholdQuestions: ProductQuestions = {
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

  beforeEach(() => {
    vi.resetAllMocks();
    questionService.clearCache();
  });

  it('fetches questions for a product type', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockHouseholdQuestions),
      } as any)
    );

    const result = await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);
    expect(result).toEqual(mockHouseholdQuestions);
    expect(global.fetch).toHaveBeenCalledWith('/data/questions/household.json');
  });

  it('caches results after first fetch', async () => {
    let fetchCallCount = 0;
    global.fetch = vi.fn(() => {
      fetchCallCount++;
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockHouseholdQuestions),
      } as any);
    });

    const first = await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);
    const second = await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);

    expect(first).toEqual(mockHouseholdQuestions);
    expect(second).toEqual(mockHouseholdQuestions);
    expect(fetchCallCount).toBe(1); // fetched only once
  });

  it('throws if fetch fails', async () => {
    global.fetch = vi.fn(() => Promise.resolve({ ok: false } as any));
    await expect(questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD)).rejects.toThrow(
      'Failed to load questions'
    );
  });

  it('throws if structure is invalid', async () => {
    const invalidQuestions = { productType: '', version: '', questions: [] };
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(invalidQuestions),
      } as any)
    );

    await expect(questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD)).rejects.toThrow(
      'Invalid question configuration structure'
    );
  });

  it('fetches buy-to-let questions correctly', async () => {
    const mockBuyToLet: ProductQuestions = {
      productType: 'buyToLet',
      version: '1.0.0',
      lastUpdated: '2024-12-10',
      questions: [
        {
          key: 'propertyType',
          displayText: 'Property Type',
          type: 'Choice',
          isRequired: true,
          answer: { type: 'String', values: [{ label: 'Flat', value: 'flat' }] },
        },
      ],
    };

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBuyToLet),
      } as any)
    );

    const result = await questionService.getQuestions(PRODUCT_TYPES.BUY_TO_LET);
    expect(result).toEqual(mockBuyToLet);
    expect(global.fetch).toHaveBeenCalledWith('/data/questions/buyToLet.json');
  });

  it('clears cache correctly', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve(mockHouseholdQuestions) } as any)
    );

    await questionService.getQuestions(PRODUCT_TYPES.HOUSEHOLD);
    expect(questionService['cache'].size).toBe(1);

    questionService.clearCache();
    expect(questionService['cache'].size).toBe(0);
  });


});
