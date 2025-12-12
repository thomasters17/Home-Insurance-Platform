import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useProductQuestions } from '@/lib/hooks/useProductQuestions';
import { questionService } from '@/lib/services/questionService';
import { ProductType } from '@/lib/types/policy.types';

vi.mock('@/lib/services/questionService', () => ({
  questionService: {
    getQuestions: vi.fn(),
  },
}));

describe('useProductQuestions hook', () => {
  const mockQuestions = [
    { id: 'q1', question: 'Test question 1' },
    { id: 'q2', question: 'Test question 2' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('loads questions successfully on mount', async () => {
    (questionService.getQuestions as any).mockResolvedValue(mockQuestions);

    const { result } = renderHook(() => useProductQuestions('household' as ProductType));

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.questions).toBeNull();
    expect(result.current.error).toBeNull();

    // Wait for async effect to complete
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.questions).toEqual(mockQuestions);
    expect(result.current.error).toBeNull();
  });

  it('sets error state if service fails', async () => {
    (questionService.getQuestions as any).mockRejectedValue(new Error('Service error'));

    const { result } = renderHook(() => useProductQuestions('buyToLet' as ProductType));

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.questions).toBeNull();
    expect(result.current.error).toBe('Failed to load questions. Please try again.');
  });

  it('reload function fetches questions again', async () => {
    (questionService.getQuestions as any)
      .mockResolvedValueOnce(mockQuestions)
      .mockResolvedValueOnce([{ id: 'q3', question: 'New question' }]);

    const { result } = renderHook(() => useProductQuestions('household' as ProductType));

    // Wait for initial load
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.questions).toEqual(mockQuestions);

    // Call reload
    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.questions).toEqual([{ id: 'q3', question: 'New question' }]);
    expect(result.current.error).toBeNull();
  });

  it('resets error on reload after previous failure', async () => {
    (questionService.getQuestions as any)
      .mockRejectedValueOnce(new Error('Service error'))
      .mockResolvedValueOnce(mockQuestions);

    const { result } = renderHook(() => useProductQuestions('household' as ProductType));

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).toBe('Failed to load questions. Please try again.');

    await act(async () => {
      await result.current.reload();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.questions).toEqual(mockQuestions);
  });
});
