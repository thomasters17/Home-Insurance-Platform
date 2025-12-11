'use client';

import { Question, isChoiceAnswer, isBooleanAnswer } from '@/lib/types/question.types';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {ErrorMessage} from "@/components/common/ErrorMessage";

interface DynamicFieldProps {
  /**
   * TODO: Build a discriminated union type for this.
   */
  question: Question;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const DynamicField = ({ question, value, onChange, error }: DynamicFieldProps)=> {
  /**
   * Render field based on type
   */
  const renderField = () => {
    // Handle Choice type (select dropdown)
    if (question.type === 'Choice' && isChoiceAnswer(question.answer)) {
      return (
        <Select
          value={value?.toString() || ''}
          onValueChange={(val) => {
            // Convert to number if answer type is Number
            const convertedValue = question.answer?.type === 'Number' ? Number(val) : val;
            onChange(convertedValue);
          }}
        >
          <SelectTrigger
            id={question.key}
            aria-invalid={!!error}
            aria-describedby={error ? `${question.key}-error` : `${question.key}-help`}
          >
            <SelectValue placeholder={`Select ${question.displayText.toLowerCase()}`} />
          </SelectTrigger>
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
          value={value?.toString() || ''}
          onValueChange={(val) => onChange(val === 'true')}
        >
          {question.answer.values.map((option) => (
            <div key={option.value.toString()} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value.toString()}
                id={`${question.key}-${option.value}`}
                aria-describedby={error ? `${question.key}-error` : undefined}
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
    return (
      <Input
        id={question.key}
        type={question.type === 'Number' ? 'number' : question.type === 'Date' ? 'date' : 'text'}
        value={value || ''}
        onChange={(e) => {
          const newValue = question.type === 'Number'
            ? Number(e.target.value)
            : e.target.value;
          onChange(newValue);
        }}
        placeholder={question.placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${question.key}-error` : `${question.key}-help`}
      />
    );
  };

  return (
    <div className="space-y-2">
      {/* Label with required indicator */}
      <Label htmlFor={question.key} className="text-sm font-medium">
        {question.displayText}
        {question.isRequired && (
          <span className="text-red-600 ml-1" aria-label="required">
            *
          </span>
        )}
      </Label>

      {/* Help text for accessibility */}
      {question.helpText && (
        <p id={`${question.key}-help`} className="text-sm text-gray-500">
          {question.helpText}
        </p>
      )}

      {/* The actual field */}
      {renderField()}

      {error && (
        <ErrorMessage message={error || 'Failed to load questions'} />
      )}
    </div>
  );
}