/**
 * Hook for loading product questions
 * Separated from form logic for better separation of concerns
 */

'use client';

import {useState, useEffect, useCallback} from 'react';
import { ProductQuestions } from '../types/question.types';
import { ProductType } from '../types/policy.types';
import { questionService } from '../services/questionService';

export function useProductQuestions(productType: ProductType) {
  const [questions, setQuestions] = useState<ProductQuestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const config = await questionService.getQuestions(productType);
      setQuestions(config);
    } catch (err) {
      console.error('Error loading questions:', err);
      setError('Failed to load questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [productType]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  return {
    questions,
    isLoading,
    error,
    reload: loadQuestions,
  };
}