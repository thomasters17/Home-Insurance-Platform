'use client';

import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PolicyFormData } from '@/lib/types/form.types';

interface PropertySectionProps {
  control: Control<PolicyFormData>;
}

export const PropertySection = ({ control }: PropertySectionProps)=> {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Property Details</h2>
        <p className="text-gray-600">Information about the property to be insured</p>
      </div>

      {/* Address Line 1 */}
      <FormField
        control={control}
        name="property.addressLine1"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Address Line 1
              <span className="text-red-600 ml-1" aria-label="required">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="House number and street name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 2 */}
      <FormField
        control={control}
        name="property.addressLine2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 2 (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Apartment, suite, etc." {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Address Line 3 */}
      <FormField
        control={control}
        name="property.addressLine3"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address Line 3 (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="Additional address details" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postcode */}
      <FormField
        control={control}
        name="property.postcode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Postcode
              <span className="text-red-600 ml-1" aria-label="required">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., SW1A 1AA"
                maxLength={8}
                {...field}
                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                value={field.value || ''}
              />
            </FormControl>
            <FormDescription>UK postcode format (max 8 characters)</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}