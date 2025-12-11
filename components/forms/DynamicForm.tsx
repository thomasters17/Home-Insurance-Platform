'use client';

import { ProductType } from '@/lib/types/policy.types';
import { usePolicyForm } from '@/lib/hooks/usePolicyForm';
import { PolicyholderSection } from './PolicyholderSection';
import { PropertySection } from './PropertySection';
import { ProductQuestionsSection } from './ProductQuestionsSection';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface DynamicFormProps {
  productType: ProductType;
}

export function DynamicForm({ productType }: DynamicFormProps) {
  const {
    formState,
    updateField,
    errors,
    getFieldError,
    submitForm,
    isSubmitting,
  } = usePolicyForm(productType);

  // Extract errors by section for cleaner passing to child components
  const policyholderErrors = {
    firstName: getFieldError('policyholder', 'firstName'),
    lastName: getFieldError('policyholder', 'lastName'),
    dateOfBirth: getFieldError('policyholder', 'dateOfBirth'),
  };

  const propertyErrors = {
    addressLine1: getFieldError('property', 'addressLine1'),
    addressLine2: getFieldError('property', 'addressLine2'),
    addressLine3: getFieldError('property', 'addressLine3'),
    postcode: getFieldError('property', 'postcode'),
  };

  const productAnswersErrors = errors
    .filter(e => e.field.startsWith('productAnswers'))
    .reduce((acc, error) => {
      const field = error.field.replace('productAnswers.', '');
      acc[field] = error.message;
      return acc;
    }, {} as Record<string, string>);

  // Check if there are any general errors
  const generalError = errors.find(e => e.field === 'general');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submitForm();
      }}
      className="max-w-3xl mx-auto space-y-12"
      noValidate // We handle validation ourselves
    >
      {/* General error alert */}
      {generalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generalError.message}</AlertDescription>
        </Alert>
      )}

      {/* Policyholder Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <PolicyholderSection
          values={formState.policyholder}
          onChange={(field, value) => updateField('policyholder', field, value)}
          errors={policyholderErrors}
        />
      </div>

      {/* Property Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <PropertySection
          values={formState.property}
          onChange={(field, value) => updateField('property', field, value)}
          errors={propertyErrors}
        />
      </div>

      {/* Product Questions Section */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <ProductQuestionsSection
          productType={productType}
          values={formState.productAnswers}
          onChange={(field, value) => updateField('productAnswers', field, value)}
          errors={productAnswersErrors}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating Policy...' : 'Create Policy'}
        </Button>
      </div>
    </form>
  );
}