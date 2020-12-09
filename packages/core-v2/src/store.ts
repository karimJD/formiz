import { RefObject } from 'react';
import create from 'zustand';
import { FieldState, FormizProps, State } from './types';
import { getDefaultField, getDefaultStep } from './utils/form.utils';

const isFormValid = (fields: FieldState[]): boolean =>
  fields.every(
    (field) =>
      !field?.errors?.length &&
      !field?.asyncErrors?.length &&
      !field?.externalErrors?.length,
  );

export const createStore = ({
  formId,
  onSubmitRef,
  onValidSubmitRef,
  onInvalidSubmitRef,
}: {
  formId: string;
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
      initialStepName: null,
      navigatedStepName: null,
    },
    steps: [],
    fields: [],
    internalActions: {
      registerStep: (name, step = {}) => {
        set((state) => {
          const steps = [
            ...state.steps,
            {
              ...getDefaultStep(name),
              ...step,
            },
          ];

          const orderedSteps = steps.sort((a, b) => a.order - b.order);
          const enabledSteps = orderedSteps.filter(
            ({ isEnabled }) => isEnabled,
          );

          const initialStepName = enabledSteps.length
            ? enabledSteps[0].name
            : null;

          const form = {
            ...state.form,
            initialStepName,
          };
          return {
            form,
            steps: orderedSteps,
          };
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
          const stepIndex = state.steps.findIndex((f) => f.name === name);
          const oldStep = state.steps[stepIndex];

          if (!oldStep) return {};

          const steps = [...state.steps];
          steps[stepIndex] = {
            ...oldStep,
            ...step,
          };

          const orderedSteps = steps.sort((a, b) => a.order - b.order);
          const enabledSteps = orderedSteps.filter(
            ({ isEnabled }) => isEnabled,
          );

          const initialStepName = enabledSteps.length
            ? enabledSteps[0].name
            : null;

          const form = {
            ...state.form,
            initialStepName,
          };
          return {
            form,
            steps: orderedSteps,
          };
        });
      },
      registerField: (name, field = {}) => {
        set((state) => {
          const fields = [
            ...state.fields,
            {
              ...getDefaultField(name),
              ...(field || {}),
            },
          ];
          const form = {
            ...state.form,
            isValid: isFormValid(fields),
          };
          return {
            form,
            fields,
          };
        });
      },
      unregisterField: (id) => {
        set((state) => {
          const fields = state.fields.filter((f) => f.id !== id);
          const form = {
            ...state.form,
            isValid: isFormValid(fields),
          };
          return {
            form,
            fields,
          };
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
          const form = {
            ...state.form,
            isValid: isFormValid(fields),
          };
          return {
            form,
            fields,
          };
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

        if (get().form.isValid && onValidSubmitRef.current) {
          onValidSubmitRef.current({ demo: 'test' }); // TODO values
        }

        if (!get().form.isValid && onInvalidSubmitRef.current) {
          onInvalidSubmitRef.current({ demo: 'test' }); // TODO values
        }

        if (onSubmitRef.current) {
          onSubmitRef.current({ demo: 'test' }); // TODO values
        }
      },
      setFieldsValues: (objectOfValues) => {},
      invalidateFields: (objectOfErrors) => {},
      getFieldStepName: (fieldName) => null,
      submitStep: (event) => {},
      goToStep: (stepName) => {},
      nextStep: () => {},
      prevStep: () => {},
      reset: () => {},
    },
  }));
