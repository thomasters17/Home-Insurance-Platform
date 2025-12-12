'use client';

import { Control } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PolicyFormData } from '@/lib/types/form.types';

interface PolicyholderSectionProps {
  control: Control<PolicyFormData>;
}

export const PolicyholderSection = ({ control }: PolicyholderSectionProps)=> {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Policyholder Information</h2>
        <p className="text-gray-600">Please provide your personal details</p>
      </div>

      {/* First Name */}
      <FormField
        control={control}
        name="policyholder.firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              First Name
              <span className="text-red-600 ml-1" aria-label="required">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter your first name" {...field} />
            </FormControl>
            <FormDescription>As shown on official documents</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Last Name */}
      <FormField
        control={control}
        name="policyholder.lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Last Name
              <span className="text-red-600 ml-1" aria-label="required">*</span>
            </FormLabel>
            <FormControl>
              <Input placeholder="Enter your last name" {...field} />
            </FormControl>
            <FormDescription>As shown on official documents</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Date of Birth */}
      <FormField
        control={control}
        name="policyholder.dateOfBirth"
        render={({ field }) => (
          <FormItem>
            <FormLabel>
              Date of Birth
              <span className="text-red-600 ml-1" aria-label="required">*</span>
            </FormLabel>
            <FormControl>
              <Input
                type="date"
                max={new Date().toISOString().split('T')[0]}
                {...field}
              />
            </FormControl>
            <FormDescription>You must be 18 or over to purchase insurance</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}