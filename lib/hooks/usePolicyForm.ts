/**
 * Custom hook for managing policy form state
 * Handles form validation, submission, and error management
 */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductType, CreatePolicyInput, ProductAnswers } from '../types/policy.types';
import { FormState, FieldError } from '../types/form.types';
import { policyService } from '../services/policyService';
import { validateFormData } from '../validations/schemas';

// TODO: Swap this out for a form lib?? RHF.
export function usePolicyForm(productType: ProductType) {
  const router = useRouter();
  const [formState, setFormState] = useState<FormState>({
    policyholder: {},
    property: {},
    productAnswers: {},
  });
  const [errors, setErrors] = useState<FieldError[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (section: keyof FormState, field: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));

    // Clear error for this field when user updates it
    setErrors(prev => prev.filter(error => error.field !== `${section}.${field}`));
  };

  const validateForm = (): boolean => {
    const result = validateFormData(
      {
        productType,
        ...formState,
      },
      productType
    );

    if (!result.success) {
      const newErrors: FieldError[] = result.error.issues.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }));
      setErrors(newErrors);
      return false;
    }

    setErrors([]);
    return true;
  };

  const submitForm = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const policyInput: CreatePolicyInput = {
        productType,
        policyholder: formState.policyholder as any,
        property: formState.property as any,
        productAnswers: formState.productAnswers as ProductAnswers,
      };

      const newPolicy = policyService.create(policyInput);

      // Navigate to policy detail page
      router.push(`/policies/${newPolicy.id}`);
    } catch (error) {
      console.error('Error creating policy:', error);
      setErrors([{ field: 'general', message: 'Failed to create policy. Please try again.' }]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = (section: keyof FormState, field: string): string | undefined => {
    const error = errors.find(e => e.field === `${section}.${field}`);
    return error?.message;
  };

  return {
    formState,
    updateField,
    errors,
    getFieldError,
    submitForm,
    validateForm,
    isSubmitting,
  };
}