import { RefObject } from 'react';
import create from 'zustand';
import lodashGet from 'lodash/get';
import { FieldState, FormizProps, FormState, State, StepState } from './types';
import {
  getDefaultField,
  getDefaultStep,
  getFormValues,
} from './utils/form.utils';

const checkIsValid = (fields: FieldState[]): boolean =>
  fields.every(
    (field) =>
      !field?.errors?.length &&
      !field?.asyncErrors?.length &&
      !field?.externalErrors?.length,
  );

const checkIsPristine = (fields: FieldState[]): boolean =>
  fields.every((field) => field.isPristine);

const checkIsValidating = (fields: FieldState[]): boolean =>
  fields.some((field) => field.isValidating);

const checkForm = (state: State): FormState => {
  return {
    ...state.form,
    isValid: checkIsValid(state.fields),
    isPristine: checkIsPristine(state.fields),
    isValidating: checkIsValidating(state.fields),
  };
};

const checkSteps = (state: State): StepState[] => {
  const steps = state.steps.map((step) => {
    const stepFields = state.fields.filter(
      (field) => field.stepName === step.name,
    );
    const isActive = state.form.navigatedStepName
      ? state.form.navigatedStepName === step.name
      : state.form.initialStepName === step.name;
    return {
      ...step,
      isValid: checkIsValid(stepFields),
      isPristine: checkIsPristine(stepFields),
      isValidating: checkIsValidating(stepFields),
      isActive,
      isVisited: step.isVisited || isActive,
    };
  });
  return steps;
};

const checkState = (state: State): State => {
  const orderedSteps = state.steps.sort((a, b) => a.order - b.order);
  const enabledSteps = orderedSteps.filter(({ isEnabled }) => isEnabled);

  const initialStepName = enabledSteps.length ? enabledSteps[0].name : null;

  const form = {
    ...state.form,
    initialStepName,
  };

  return {
    ...state,
    form: checkForm({ ...state, form }),
    steps: checkSteps(state),
  };
};

const getStateWithStep = (
  state: State,
  step: { name: string } & Partial<StepState>,
) => {
  const stepIndex = state.steps.findIndex((f) => f.name === step.name);
  const oldStep = state.steps[stepIndex];

  const isActive = state.form.navigatedStepName
    ? state.form.navigatedStepName === step.name
    : state.form.initialStepName === step.name;

  const newStep = {
    ...getDefaultStep(step.name),
    ...step,
    isActive,
  };

  const steps = !oldStep ? [...state.steps, newStep] : [...state.steps];

  if (oldStep) {
    steps[stepIndex] = {
      ...oldStep,
      ...newStep,
    };
  }

  return checkState({
    ...state,
    steps,
  });
};

export const createStore = ({
  formId,
  initialValuesRef,
  onSubmitRef,
  onValidSubmitRef,
  onInvalidSubmitRef,
}: {
  formId: FormState['id'];
  initialValuesRef: RefObject<FormizProps['initialValues']>;
  onSubmitRef: RefObject<FormizProps['onSubmit']>;
  onValidSubmitRef: RefObject<FormizProps['onValidSubmit']>;
  onInvalidSubmitRef: RefObject<FormizProps['onInvalidSubmit']>;
}) =>
  create<State>((set, get) => ({
    form: {
      id: formId,
      resetKey: 0,
      isValid: true,
      isValidating: false,
      isSubmitted: false,
      isPristine: true,
      initialStepName: null,
      navigatedStepName: null,
    },
    steps: [],
    fields: [],
    internalActions: {
      registerStep: (name, step = {}) => {
        set((state) => {
          return getStateWithStep(state, {
            name,
            ...step,
          });
        });
      },
      unregisterStep: (name) => {
        set((state) => {
          const steps = state.steps.filter((s) => s.name !== name);
          return {
            steps,
          };
        });
      },
      updateStep: (name, step = {}) => {
        set((state) => {
          return getStateWithStep(state, {
            name,
            ...step,
          });
        });
      },
      registerField: (name, field = {}) => {
        set((state) => {
          const defaultField = getDefaultField(name);
          const initialValue =
            lodashGet(initialValuesRef.current, name) ??
            field.initialValue ??
            field.value ??
            defaultField.value;

          const newField = {
            ...defaultField,
            ...(field || {}),
            value: initialValue,
            initialValue,
          };

          const fields = [...state.fields, newField];
          return checkState({
            ...state,
            fields,
          });
        });
      },
      unregisterField: (id) => {
        set((state) => {
          const fields = state.fields.filter((f) => f.id !== id);
          return checkState({
            ...state,
            fields,
          });
        });
      },
      updateField: (id, field = {}) => {
        set((state) => {
          const oldField = state.fields.find((f) => f.id === id);

          if (!oldField) return {};

          const otherFields = state.fields.filter((f) => f.id !== id);
          const fields = [
            ...otherFields,
            {
              ...oldField,
              ...field,
            },
          ];
          return checkState({
            ...state,
            fields,
          });
        });
      },
    },
    exposedActions: {
      submit: (event) => {
        if (event) event.preventDefault();

        set((state) => {
          const form = { ...state.form, isSubmitted: true };
          const steps = state.steps.map((step) => ({
            ...step,
            isSubmitted: true,
          }));
          return {
            form,
            steps,
          };
        });

        const values = getFormValues(get().fields);

        if (get().form.isValid && !get().form.isValidating) {
          if (onValidSubmitRef.current) {
            onValidSubmitRef.current(values);
          }
        } else {
          if (onInvalidSubmitRef.current) {
            onInvalidSubmitRef.current(values);
          }
        }

        if (onSubmitRef.current) {
          onSubmitRef.current(values);
        }
      },
      setFieldsValues: (objectOfValues) => {
        if (!objectOfValues) return;
        set((state) => {
          const fields = state.fields.map((field) => ({
            ...field,
            value: objectOfValues[field.name] ?? field.value,
          }));

          return checkState({
            ...state,
            fields,
          });
        });
      },
      // TODO Documenation about rename from invalidateFields to setFieldsErrors
      setFieldsErrors: (objectOfErrors) => {
        if (!objectOfErrors) return;

        set((state) => {
          const fields = state.fields.map((field) => ({
            ...field,
            externalErrors: objectOfErrors[field.name]
              ? [objectOfErrors[field.name], ...field.externalErrors]
              : field.externalErrors,
          }));

          return checkState({
            ...state,
            fields,
          });
        });
      },
      getFieldStepName: (fieldName) => {
        // TODO
        return null;
      },
      submitStep: (event) => {
        if (event) event.preventDefault();

        set((state) => ({
          steps: state.steps.map((step) => ({
            ...step,
            isSubmitted: step.isActive ? true : step.isSubmitted,
          })),
        }));

        const currentStep = get().steps.find((step) => step.isActive);

        if (!currentStep?.isValid || currentStep?.isValidating) {
          return;
        }

        const enabledSteps = get().steps.filter((step) => step.isEnabled);
        const isLastStep =
          enabledSteps[enabledSteps.length - 1]?.name === currentStep?.name;

        if (isLastStep) {
          get().exposedActions.submit();
          return;
        }

        get().exposedActions.nextStep();
      },
      goToStep: (stepName) => {
        set((state) => {
          if (!stepName) return {};

          const targetedStepName = state.steps
            .filter(({ isEnabled }) => isEnabled)
            .find(({ name }) => name === stepName)?.name;

          if (!targetedStepName) return {};

          const form = {
            ...state.form,
            navigatedStepName: targetedStepName,
          };

          return checkState({ ...state, form });
        });
      },
      nextStep: () => {
        const state = get();
        const enabledSteps = state.steps.filter((x) => x.isEnabled);
        const stepIndex = enabledSteps.findIndex((step) => step.isActive);
        state.exposedActions.goToStep(enabledSteps[stepIndex + 1]?.name);
      },
      prevStep: () => {
        const state = get();
        const enabledSteps = state.steps.filter((x) => x.isEnabled);
        const stepIndex = enabledSteps.findIndex((step) => step.isActive);
        state.exposedActions.goToStep(enabledSteps[stepIndex - 1]?.name);
      },
      reset: () => {
        set((state) => {
          const form = {
            ...state.form,
            resetKey: state.form.resetKey + 1,
            isSubmitted: false,
            navigatedStepName: null,
          };
          const steps = state.steps.map((step) => ({
            ...step,
            isSubmitted: false,
            isVisited: false,
          }));
          const fields = state.fields.map((field) => ({
            ...field,
            value: field.initialValue,
          }));
          return checkState({
            ...state,
            form,
            steps,
            fields,
          });
        });
      },
    },
  }));
