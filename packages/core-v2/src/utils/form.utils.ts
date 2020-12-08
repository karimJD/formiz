import { Field, FieldState, FormState, StepState } from '../types';
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

export const getExposedField = (
  {
    name,
    externalErrors,
    asyncErrors,
    errors,
    isPristine,
    isValidating,
    // stepName,
    // resetKey,
    value,
  }: FieldState,
  form: Pick<
    FormState,
    'id' | 'isSubmitted' | 'navigatedStepName' | 'initialStepName'
  >,
): Field => {
  const allErrors = [...externalErrors, ...asyncErrors, ...errors];
  // const currentStepName =
  //   formState.navigatedStepName || formState.initialStepName;
  // const currentStep: StepState | null =
  //   formState.steps.find((x) => x.name === currentStepName) || null;
  // const isSubmitted =
  //   stepName && currentStep && currentStepName === stepName
  //     ? currentStep.isSubmitted
  //     : formState.isSubmitted;
  return {
    id: getFieldHtmlUniqueId(form.id, name),
    errorMessage: allErrors[0],
    errorMessages: allErrors,
    isPristine,
    isValid: !allErrors.length,
    isValidating,
    // isSubmitted,
    value,
    // resetKey,
  };
};
