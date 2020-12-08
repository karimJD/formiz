import { ReactNode } from 'react';
import { UseStore } from 'zustand';

export type FormizContextType = {
  useStore: UseStore<State>;
} | null;

export type FieldValue = any;
export type FieldError = string | undefined;
export type FieldErrors = FieldError[];
export interface FieldValidationObject {
  rule(value: FieldValue): boolean;
  message?: string;
  deps?: any[];
}
export interface FieldAsyncValidationObject {
  rule(value: FieldValue): Promise<boolean>;
  message?: string;
  deps?: any[];
}
export interface FieldProps {
  name: string;
  defaultValue?: FieldValue;
  formatValue?(value: FieldValue): FieldValue;
  onChange?(value?: FieldValue, rawValue?: FieldValue): void;
  required?: boolean | string;
  validations?: FieldValidationObject[];
  asyncValidations?: FieldAsyncValidationObject[];
}

export interface FieldState {
  id: string;
  name: string;
  value: FieldValue;
  errors: FieldErrors;
  asyncErrors: FieldErrors;
  externalErrors: FieldErrors;
  isValidating: boolean;
  isPristine: boolean;
  stepName?: string;
}

export interface Field {
  errorMessage?: FieldError;
  errorMessages?: FieldErrors;
  isPristine: boolean;
  isValid: boolean;
  isValidating: boolean;
  // isSubmitted: boolean;
  value: FieldValue;
  // resetKey: number;
  id: string;
}

export interface UseFieldValues extends Field {
  setValue(value: FieldValue): void;
  otherProps?: any;
}

export interface FormState {
  id: string;
  resetKey: number;
  isValid: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
  isStepValid: boolean;
  isStepValidating: boolean;
  isStepSubmitted: boolean;
}
export interface StepState {
  name: string;
  label?: React.ReactNode;
  order: number;
  isCurrent: boolean;
  isValid: boolean;
  isVisited: boolean;
  isPristine: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
  isEnabled: boolean;
}

export interface FormActions {
  registerField(name: string, defaultField?: Partial<FieldState>): void;
  unregisterField(id: string): void;
  updateField(id: string, field: Partial<FieldState>): void;
}

export interface FormizStepProps {
  as?: any;
  name: string;
  label?: string;
  children?: ReactNode;
  isEnabled?: boolean;
  order?: number;
  style?: object;
}

export interface FormizProps {
  children?: ReactNode;
  connect?(store: any): void;
  id?: string;
}

export type State = {
  form: FormState;
  steps: StepState[];
  fields: FieldState[];
  actions: FormActions;
};
