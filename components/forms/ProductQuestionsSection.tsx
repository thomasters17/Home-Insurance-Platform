'use client';

import { useEffect, useState } from 'react';
import { DynamicField } from './DynamicField';
import { ProductQuestions } from '@/lib/types/question.types';
import { questionService } from '@/lib/services/questionService';
import { ProductType } from '@/lib/types/policy.types';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import {ErrorMessage} from "@/components/common/ErrorMessage";

interface ProductQuestionsSectionProps {
  productType: ProductType;
  values: Record<string, any>;
  onChange: (field: string, value: any) => void;
  errors: Record<string, string>;
}

export const ProductQuestionsSection = ({
                                          productType,
                                          values,
                                          onChange,
                                          errors,
                                        }: ProductQuestionsSectionProps)=> {
  const [questions, setQuestions] = useState<ProductQuestions | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadQuestions();
  }, [productType]);

  const loadQuestions = async () => {
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
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <ErrorMessage message={error || 'Failed to load questions'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Product-Specific Questions</h2>
        <p className="text-gray-600">
          {productType === 'household'
            ? 'Information about your household insurance needs'
            : 'Information about your buy-to-let property'}
        </p>
      </div>

      {/* Dynamically render all questions from config */}
      {questions.questions.map((question) => (
        <DynamicField
          key={question.key}
          question={question}
          value={values[question.key]}
          onChange={(value) => onChange(question.key, value)}
          error={errors[question.key]}
        />
      ))}
    </div>
  );
}