import {describe, it, expect, vi, beforeEach, Mock} from 'vitest';
import { renderHook, act } from '@testing-library/react';
import {usePolicies} from "@/lib/hooks/usePolicies";
import {policyService} from "@/lib/services/policyService";

vi.mock('@/lib/services/policyService', () => ({
  policyService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    getByProductType: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('usePolicies hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (policyService.getAll as Mock).mockReturnValue([
      { id: '1', productType: 'household' },
      { id: '2', productType: 'buyToLet' },
    ]);

    (policyService.getById as Mock).mockImplementation((id: string) =>
      id === '1' ? { id: '1', productType: 'household' } : undefined
    );

    (policyService.getByProductType as Mock).mockImplementation((type: string) =>
      type === 'household' ? [{ id: '1', productType: 'household' }] : []
    );

    (policyService.delete as Mock).mockReturnValue(true);
  });

  it('loads policies on mount', () => {
    const { result } = renderHook(() => usePolicies());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.policies).toHaveLength(2);
  });

  it('returns a policy by id', () => {
    const { result } = renderHook(() => usePolicies());
    const found = result.current.getPolicyById('1');
    expect(found).toEqual({ id: '1', productType: 'household' });
  });

  it('filters policies by product type', () => {
    const { result } = renderHook(() => usePolicies());
    const filtered = result.current.getPoliciesByType('household');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe('1');
  });

  it('deletes a policy and reloads list', () => {
    const { result } = renderHook(() => usePolicies());
    act(() => {
      const success = result.current.deletePolicy('1');
      expect(success).toBe(true);
    });
    expect((policyService.getAll as Mock).mock.calls.length).toBe(2);
  });

  it('refreshes the policies list', () => {
    const { result } = renderHook(() => usePolicies());
    act(() => {
      result.current.refresh();
    });
    expect((policyService.getAll as Mock).mock.calls.length).toBe(2);
  });

  it('provides correct count', () => {
    const { result } = renderHook(() => usePolicies());
    expect(result.current.count).toBe(2);
  });
});
