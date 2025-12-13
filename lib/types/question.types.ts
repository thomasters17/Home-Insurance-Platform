/**
 * Type definitions for the dynamic question configuration system.
 * These types match the JSON schema used in household.json and buyToLet.json
 */
import {ProductType} from "@/lib/types/policy.types";

export type FieldType = 'Choice' | 'Boolean' | 'Text' | 'Number' | 'Date';
export type BooleanRenderType = 'radio' | 'checkbox' | 'toggle';

/**
 * Validation rule structure that can be extended for different validation types
 */
export interface ValidationRule {
  required?: {
    value: boolean;
    message: string;
  };
  min?: {
    value: number;
    message: string;
  };
  max?: {
    value: number;
    message: string;
  };
  pattern?: {
    value: string; // Regex pattern
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
  maxLength?: {
    value: number;
    message: string;
  };
}

/**
 * Option structure for Choice fields (select/radio)
 */
export interface OptionValue {
  label: string;
  value: string | number | boolean;
  description?: string; // For accessibility
}

/**
 * Answer structure for Choice type questions
 */
export interface ChoiceAnswer {
  type: 'String' | 'Number';
  values: OptionValue[];
}

/**
 * Answer structure for Boolean type questions
 */
export interface BooleanAnswer {
  type: 'Boolean';
  renderAs: BooleanRenderType;
  values: OptionValue[];
}

/**
 * Individual question configuration from JSON
 * This is the core structure that drives the dynamic form rendering
 */
export interface Question {
  key: string; // Unique identifier (matches form field name)
  displayText: string; // Label shown to user
  type: FieldType;
  isRequired: boolean;
  helpText?: string; // For tooltips and screen readers
  ariaLabel?: string; // Override label for screen readers
  placeholder?: string; // For text inputs
  defaultValue?: string | number | boolean;
  validation?: ValidationRule;
  answer: ChoiceAnswer | BooleanAnswer | null; // null for Text/Number/Date inputs
}

/**
 * Complete product question configuration (top-level JSON structure)
 */
export interface ProductQuestions {
  productType: ProductType;
  version: string; // Semantic versioning for config changes
  lastUpdated: string; // ISO 8601 date
  questions: Question[];
}

/**
 * Type guard to check if answer is ChoiceAnswer
 */
export function isChoiceAnswer(answer: ChoiceAnswer | BooleanAnswer | null): answer is ChoiceAnswer {
  return answer !== null && 'values' in answer && (answer.type === 'String' || answer.type === 'Number');
}

/**
 * Type guard to check if answer is BooleanAnswer
 */
export function isBooleanAnswer(answer: ChoiceAnswer | BooleanAnswer | null): answer is BooleanAnswer {
  return answer !== null && answer.type === 'Boolean';
}