"use client"

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductType } from '@/lib/types/policy.types';
import { PolicyFormData } from '@/lib/types/form.types';
import {
  policyholderSchema,
  propertySchema,
  householdAnswersSchema,
  buyToLetAnswersSchema
} from '@/lib/validations/schemas';
import { buildProductAnswersSchema } from '@/lib/services/schemaBuilder';
import { useProductQuestions } from '@/lib/hooks/useProductQuestions';
import { policyService } from '@/lib/services/policyService';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { PolicyholderSection } from './PolicyholderSection';
import { PropertySection } from './PropertySection';
import { ProductQuestionsSection } from './ProductQuestionsSection';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { z } from 'zod';
import { useMemo, useState } from "react";
import { PRODUCT_TYPES } from "@/lib/utils/constants";

interface DynamicFormProps {
  productType: ProductType;
}

export const DynamicForm = ({ productType }: DynamicFormProps) => {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { questions, isLoading, error } = useProductQuestions(productType);

  const formSchema = useMemo(() => {
    if (!questions) return null;

    const baseProductSchema = productType === PRODUCT_TYPES.HOUSEHOLD
      ? householdAnswersSchema
      : buyToLetAnswersSchema;

    const dynamicProductSchema = buildProductAnswersSchema(questions, baseProductSchema);

    return z.object({
      productType: z.literal(productType),
      policyholder: policyholderSchema,
      property: propertySchema,
      productAnswers: dynamicProductSchema,
    });
  }, [productType, questions]);

  const form = useForm<PolicyFormData>({
    resolver: formSchema ? zodResolver(formSchema) : undefined,
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
      productAnswers: {},
    },
    mode: 'onBlur'
  });

  const onSubmit = async (data: PolicyFormData) => {
    try {
      setSubmitError(null);
      const newPolicy = policyService.create({
        productType: data.productType,
        policyholder: data.policyholder,
        property: data.property,
        productAnswers: data.productAnswers,
      });
      router.push(`/policies/${newPolicy.id}`);
    } catch (error) {
      console.error('Error creating policy:', error);
      setSubmitError('Failed to create policy. Please try again.');
    }
  };

  if (isLoading || !formSchema) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600">Loading form...</p>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <Alert variant="destructive" className="max-w-3xl mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>Failed to load form. Please try again.</AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-3xl mx-auto space-y-12">
        {submitError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <PolicyholderSection control={form.control} />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <PropertySection control={form.control} />
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <ProductQuestionsSection productType={productType} control={form.control} />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={form.formState.isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Creating Policy...' : 'Create Policy'}
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="mt-8 p-4 bg-gray-100 rounded">
            <summary className="cursor-pointer font-medium">Debug</summary>
            <pre className="mt-2 text-xs overflow-auto">
              {JSON.stringify({ values: form.getValues(), errors: form.formState.errors }, null, 2)}
            </pre>
          </details>
        )}
      </form>
    </Form>
  );
}