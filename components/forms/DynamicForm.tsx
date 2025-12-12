"use client"

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType, HouseholdAnswers, BuyToLetAnswers } from '@/lib/types/policy.types';
import { PolicyFormData } from '@/lib/types/form.types';
import {
  policyholderSchema,
  propertySchema,
  householdAnswersSchema,
  buyToLetAnswersSchema
} from '@/lib/validations/schemas';
import { policyService } from '@/lib/services/policyService';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PolicyholderSection } from './PolicyholderSection';
import { PropertySection } from './PropertySection';
import { ProductQuestionsSection } from './ProductQuestionsSection';
import { z } from 'zod';
import {useMemo, useState} from "react";
import {PRODUCT_TYPES} from "@/lib/utils/constants";

interface DynamicFormProps {
  productType: ProductType;
}

export const DynamicForm = ({ productType }: DynamicFormProps) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  /**
   * Dynamic schema composition - we build the schema
   * at runtime based on the product type, ensuring type-safe validation
   */
  const formSchema = useMemo(() => {
    return z.object({
      productType: z.literal(productType),
      policyholder: policyholderSchema,
      property: propertySchema,
      productAnswers: productType === PRODUCT_TYPES.HOUSEHOLD
        ? householdAnswersSchema
        : buyToLetAnswersSchema,
    });
  }, [productType]);

  const form = useForm<PolicyFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productType,
      policyholder: {
        firstName: '',
        lastName: '',
        dateOfBirth: '',
      },
      property: {
        addressLine1: '',
        addressLine2: '',
        addressLine3: '',
        postcode: '',
      },
      productAnswers: {} as HouseholdAnswers | BuyToLetAnswers,
    },
    mode: 'onBlur', // Validate on blur for better UX
  });

  const onSubmit = async (data: PolicyFormData) => {
    try {
      setSubmitError(null);

      // Create the policy
      const newPolicy = policyService.create({
        productType: data.productType,
        policyholder: data.policyholder,
        property: data.property,
        productAnswers: data.productAnswers,
      });

      // Navigate to policy detail page
      router.push(`/policies/${newPolicy.id}`);
    } catch (error) {
      console.error('Error creating policy:', error);
      setSubmitError('Failed to create policy. Please try again.');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-3xl mx-auto space-y-12"
        noValidate
      >
        {/* General error alert */}
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        {/* Policyholder Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <PolicyholderSection control={form.control} />
        </div>

        {/* Property Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <PropertySection control={form.control} />
        </div>

        {/* Product Questions Section */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <ProductQuestionsSection
            productType={productType}
            control={form.control}
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={form.formState.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Creating Policy...' : 'Create Policy'}
          </Button>
        </div>

        {/* Debug: Show form state in development */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-gray-100 rounded">
            <summary className="cursor-pointer font-medium">Debug: Form State</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify({
                values: form.getValues(),
                errors: form.formState.errors,
                isDirty: form.formState.isDirty,
                isValid: form.formState.isValid,
              }, null, 2)}
            </pre>
          </details>
        )}
      </form>
    </Form>
  );
}