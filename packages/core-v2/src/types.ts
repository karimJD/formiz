import { ReactNode } from 'react';
import { UseStore } from 'zustand';

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
  initialValue: FieldValue;
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
  isSubmitted: boolean;
  value: FieldValue;
  resetKey: number;
  id: string;
}

export interface UseFieldValues extends Field {
  setValue(value: FieldValue): void;
  otherProps: any;
}

export interface FormState {
  id: string;
  resetKey: number;
  isValid: boolean;
  isValidating: boolean;
  isSubmitted: boolean;
  isPristine: boolean;
  initialStepName: string | null;
  navigatedStepName: string | null;
}

export type FormStateInField = Pick<
  FormState,
  'id' | 'resetKey' | 'isSubmitted' | 'navigatedStepName' | 'initialStepName'
>;

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
  isActive: boolean;
}

export type StepStateInField = undefined | Pick<StepState, 'isSubmitted'>;
export type StepStateInStep = undefined | Pick<StepState, 'isActive'>;

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
  autoForm?: boolean;
  children?: React.ReactNode;
  connect?(store: any): void;
  initialValues?: object;
  id?: string;
  onChange?(values: object): void;
  onSubmit?(values: object): void;
  onValidSubmit?(values: object): void;
  onInvalidSubmit?(values: object): void;
  onValid?(): void;
  onInvalid?(): void;
}

export interface FormExposedActions {
  submit(event?: React.FormEvent<HTMLFormElement>): void;
  setFieldsValues(objectOfValues: { [key: string]: FieldValue }): void;
  invalidateFields(objectOfErrors: { [key: string]: string }): void;
  getFieldStepName(fieldName: string): null | string;
  submitStep(event?: React.FormEvent<HTMLFormElement>): void;
  goToStep(stepName: string): void;
  nextStep(): void;
  prevStep(): void;
  reset(): void;
}

export interface FormInternalActions {
  registerStep(name: string, step?: Partial<StepState>): void;
  unregisterStep(name: string): void;
  updateStep(name: string, step?: Partial<StepState>): void;
  registerField(name: string, field?: Partial<FieldState>): void;
  unregisterField(id: string): void;
  updateField(id: string, field: Partial<FieldState>): void;
}

export interface UseFormValues extends FormExposedActions {
  connect(store: any): void;
  state: any;
}

export type State = {
  form: FormState;
  steps: StepState[];
  fields: FieldState[];
  internalActions: FormInternalActions;
  exposedActions: FormExposedActions;
};

export type FormizContextType = {
  useStore: UseStore<State>;
} | null;
