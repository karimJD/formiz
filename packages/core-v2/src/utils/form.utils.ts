import { Field, FieldState, StepState } from '../types';
import { getFieldHtmlUniqueId, getFieldUniqueId } from './ids.utils';

export const getDefaultStep = (name: string): StepState => ({
  name,
  order: 0,
  label: null,
  isCurrent: false,
  isValid: true,
  isVisited: false,
  isPristine: true,
  isValidating: false,
  isSubmitted: false,
  isEnabled: true,
  isActive: false,
});

export const getDefaultField = (name: string): FieldState => ({
  id: getFieldUniqueId(),
  name,
  value: null,
  errors: [],
  asyncErrors: [],
  externalErrors: [],
  isValidating: false,
  isPristine: true,
});

export const getExposedField = ({
  field: {
    name,
    externalErrors,
    asyncErrors,
    errors,
    isPristine,
    isValidating,
    // resetKey, // TODO
    value,
  },
  formId,
  isSubmitted,
}: {
  field: FieldState;
  formId: string;
  isSubmitted: boolean;
}): Field => {
  const allErrors = [...externalErrors, ...asyncErrors, ...errors];
  return {
    id: getFieldHtmlUniqueId(formId, name),
    errorMessage: allErrors[0],
    errorMessages: allErrors,
    isPristine,
    isValid: !allErrors.length,
    isValidating,
    isSubmitted,
    value,
    // resetKey, // TODO
  };
};
