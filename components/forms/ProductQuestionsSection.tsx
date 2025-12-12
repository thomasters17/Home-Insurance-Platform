'use client';

import { Control, FieldPath } from 'react-hook-form';
import { FormField } from '@/components/ui/form';
import { DynamicField } from './DynamicField';
import { ProductType } from '@/lib/types/policy.types';
import { PolicyFormData } from '@/lib/types/form.types';
import { useProductQuestions } from '@/lib/hooks/useProductQuestions';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorMessage } from '@/components/common/ErrorMessage';

interface ProductQuestionsSectionProps {
  productType: ProductType;
  control: Control<PolicyFormData>;
}

export const ProductQuestionsSection = ({ productType, control }: ProductQuestionsSectionProps) => {
  const { questions, isLoading, error } = useProductQuestions(productType);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !questions) {
    return <ErrorMessage message={error || 'Failed to load questions'} />;
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

      {/*
        We construct the field path dynamically and cast it
        to FieldPath<PolicyFormData>. This is safe because:
        1. We know the path starts with "productAnswers."
        2. The validation schema will catch any invalid fields
        3. TypeScript can't know dynamic JSON keys at compile time
      */}
      {questions.questions.map((question) => {
        const fieldName = `productAnswers.${question.key}` as FieldPath<PolicyFormData>;

        return (
          <FormField
            key={question.key}
            control={control}
            name={fieldName}
            render={({ field }) => (
              <DynamicField question={question} field={field} />
            )}
          />
        );
      })}
    </div>
  );
}