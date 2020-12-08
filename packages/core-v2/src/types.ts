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

export interface FormProps {
  children?: ReactNode;
  connect?(store: any): void;
  id?: string;
}
export type State = {
  form: {
    id: string;
    resetKey: number;
    isValid: boolean;
    isValidating: boolean;
    isSubmitted: boolean;
    isStepValid: boolean;
    isStepValidating: boolean;
    isStepSubmitted: boolean;
  };
  fields: FieldState[];
  actions: {
    registerField(name: string, defaultField?: Partial<FieldState>): void;
    unregisterField(id: string): void;
    updateField(id: string, field: Partial<FieldState>): void;
  };
};
