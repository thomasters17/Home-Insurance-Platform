'use client';

import { ControllerRenderProps } from 'react-hook-form';
import { Question, isChoiceAnswer, isBooleanAnswer } from '@/lib/types/question.types';
import { PolicyFormData } from '@/lib/types/form.types';
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface DynamicFieldProps {
  question: Question;
  field: ControllerRenderProps<PolicyFormData, any>; // 'any' here is acceptable for path string
}

export const DynamicField = ({ question, field }: DynamicFieldProps)=>  {
  const describedById = question.helpText ? `${question.key}-help` : undefined;

  /**
   * Render field based on type
   */
  const renderField = () => {
    // Handle Choice type (select dropdown)
    if (question.type === 'Choice' && isChoiceAnswer(question.answer)) {
      return (
        <Select
          onValueChange={(val) => {
            // Convert to number if answer type is Number
            const convertedValue = question.answer?.type === 'Number' ? Number(val) : val;
            field.onChange(convertedValue);
          }}
          value={field.value?.toString() || ''}
          // triggers field validation on blur
          onOpenChange={(open) => {
            if (!open) field.onBlur();
          }}
        >
          <FormControl>
            <SelectTrigger
              aria-label={question.ariaLabel}
              aria-required={question.isRequired || undefined}
              aria-describedby={describedById}
            >
              <SelectValue placeholder={`Select ${question.displayText.toLowerCase()}`} />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {question.answer.values.map((option) => (
              <SelectItem key={option.value.toString()} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Handle Boolean type (radio buttons)
    if (question.type === 'Boolean' && isBooleanAnswer(question.answer)) {
      return (
        <RadioGroup
          onValueChange={(val) => field.onChange(val === 'true')}
          value={field.value?.toString() || ''}
          aria-label={question.ariaLabel}
          aria-required={question.isRequired || undefined}
          aria-describedby={describedById}
        >
          {question.answer.values.map((option) => (
            <div key={option.value.toString()} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value.toString()}
                id={`${question.key}-${option.value}`}
              />
              <Label
                htmlFor={`${question.key}-${option.value}`}
                className="font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      );
    }

    // Handle Text/Number/Date types
    const inputType = question.type === 'Number' ? 'number' : question.type === 'Date' ? 'date' : 'text';

    return (
      <FormControl>
        <Input
          type={inputType}
          placeholder={question.placeholder}
          aria-label={question.ariaLabel}
          aria-required={question.isRequired || undefined}
          aria-describedby={describedById}
          {...field}
          onChange={(e) => {
            const newValue = question.type === 'Number'
              ? Number(e.target.value)
              : e.target.value;
            field.onChange(newValue);
          }}
          value={field.value || ''}
        />
      </FormControl>
    );
  };

  return (
    <FormItem>
      <FormLabel>
        {question.displayText}
        {question.isRequired && (
          <span className="text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </FormLabel>
      {renderField()}
      {question.helpText && (
        <FormDescription id={describedById}>{question.helpText}</FormDescription>
      )}
      <FormMessage />
    </FormItem>
  );
}