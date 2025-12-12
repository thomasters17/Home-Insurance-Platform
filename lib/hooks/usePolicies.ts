/**
 * Custom hook for managing policy data
 * Provides a clean interface for components to interact with policies
 */

'use client';

import { useState, useEffect } from 'react';
import { Policy, ProductType } from '../types/policy.types';
import { policyService } from '../services/policyService';

export function usePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadPolicies = () => {
    setIsLoading(true);
    const allPolicies = policyService.getAll();
    setPolicies(allPolicies);
    setIsLoading(false);
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const getPolicyById = (id: string): Policy | undefined => {
    return policyService.getById(id);
  };

  const getPoliciesByType = (productType: ProductType): Policy[] => {
    return policyService.getByProductType(productType);
  };

  const deletePolicy = (id: string): boolean => {
    const success = policyService.delete(id);
    if (success) {
      loadPolicies(); // Refresh list
    }
    return success;
  };

  return {
    policies,
    isLoading,
    getPolicyById,
    getPoliciesByType,
    deletePolicy,
    refresh: loadPolicies,
    count: policies.length,
  };
}