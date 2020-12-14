import { useCallback, useContext, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import {
  UseFieldValues,
  FieldState,
  FieldErrors,
  FieldAsyncValidationObject,
  FieldProps,
  FieldValidationObject,
  FormStateInField,
  StepStateInField,
  FieldValue,
} from './types';
import { getDefaultField, getExposedField } from './utils/form.utils';
import { FormizContext } from './Formiz';
import { FormizStepContext } from './FormizStep';

const getValidationsWithRequired = (
  validations: FieldValidationObject[],
  required: boolean | string,
) => {
  if (!required && required !== '') {
    return validations;
  }
  return [
    ...validations,
    {
      rule: (x: FieldValue) => !!x || x === 0,
      message: required !== true ? required : '',
    },
  ];
};

export const useField = ({
  name,
  defaultValue = null,
  required = false,
  validations = [],
  asyncValidations = [],
  formatValue = (value) => value,
  ...otherProps
}: FieldProps): UseFieldValues => {
  const isMountedRef = useRef(true);
  const formizContext = useContext(FormizContext);

  if (!formizContext) {
    throw new Error('TODO');
  }

  const { useStore } = formizContext;

  const formizStepContext = useContext(FormizStepContext);
  const stepName = formizStepContext?.name;

  const field = useStore(
    useCallback((state) => state.fields?.find((f) => f.name === name), [name]),
    shallow,
  );
  const form = useStore<FormStateInField>(
    useCallback(
      ({
        form: { id, resetKey, isSubmitted, initialStepName, navigatedStepName },
      }): FormStateInField => ({
        id,
        resetKey,
        isSubmitted,
        initialStepName,
        navigatedStepName,
      }),
      [],
    ),
    shallow,
  );
  const step = useStore<StepStateInField>(
    useCallback(
      ({ steps }) => {
        const currentStep = steps.find((step) => step.name === stepName);
        return currentStep
          ? { isSubmitted: currentStep.isSubmitted }
          : undefined;
      },
      [stepName],
    ),
    shallow,
  );
  const isSubmitted = step?.isSubmitted ?? form.isSubmitted;
  const { registerField, unregisterField, updateField } = useStore(
    useCallback((state) => state.internalActions, []),
  );

  const fieldRef = useRef<FieldState>();
  fieldRef.current = field;
  const defaultValueRef = useRef<Pick<FieldProps, 'defaultValue'>>();
  defaultValueRef.current = defaultValue;
  const validationsRef = useRef<FieldProps['validations']>();
  validationsRef.current = getValidationsWithRequired(
    validations || [],
    required,
  );
  const asyncValidationsRef = useRef<FieldProps['asyncValidations']>();
  asyncValidationsRef.current = asyncValidations;
  const formatValueRef = useRef<FieldProps['formatValue']>();
  formatValueRef.current = formatValue;

  const setValue = useCallback(
    (value) => {
      if (!field?.id) return;
      updateField(field.id, {
        name,
        value,
        formattedValue: formatValueRef.current?.(value),
        externalErrors: [],
        isPristine: false,
      });
    },
    [field?.id, name, updateField],
  );

  // Register / Unregister Field
  useEffect(() => {
    registerField(name, {
      stepName,
      initialValue: formatValueRef.current?.(defaultValueRef.current),
    });
    return () => {
      if (fieldRef.current?.id) {
        unregisterField(fieldRef.current.id);
      }
    };
  }, [registerField, unregisterField, name, stepName]);

  // Trigger setValue if value is changed in global state
  useEffect(
    () => {
      setValue(field?.value);
    },
    /* eslint-disable react-hooks/exhaustive-deps */ [
      setValue,
      JSON.stringify(field?.value),
    ],
  ); /* eslint-enable */

  // Validations
  useEffect(
    () => {
      const validateField = async () => {
        if (!field || !field.id) return;
        /**
         * Sync validations
         */

        const fieldErrors = (validationsRef.current || []).reduce(
          (errors: FieldErrors, validation: FieldValidationObject) =>
            !validation.rule(field.formattedValue, field.value)
              ? [...errors, validation.message]
              : errors,
          [],
        );

        const shouldRunAsyncValidations =
          !fieldErrors.length && !!(asyncValidationsRef.current || []).length;

        updateField(field.id, {
          errors: fieldErrors,
          asyncErrors: [],
          isValidating: shouldRunAsyncValidations,
        });

        if (!shouldRunAsyncValidations) {
          return;
        }

        /**
         * Async validations
         */

        const rules = await Promise.all(
          (asyncValidationsRef.current || []).map(
            async (validation: FieldAsyncValidationObject) => {
              const isValid = await validation.rule(
                field.formattedValue,
                field.value,
              );
              return {
                ...validation,
                isValid,
              };
            },
          ),
        );

        if (!isMountedRef.current || field.value !== fieldRef.current?.value) {
          updateField(field.id, {
            isValidating: false,
          });
          return;
        }

        const fieldAsyncErrors: FieldErrors = rules.reduce(
          (
            errors: FieldErrors,
            validation: FieldAsyncValidationObject & { isValid: boolean },
          ) => (!validation.isValid ? [...errors, validation.message] : errors),
          [],
        );

        updateField(field.id, {
          asyncErrors: fieldAsyncErrors,
          isValidating: false,
        });
      };

      validateField();
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      field?.id,
      updateField,
      JSON.stringify(field?.value),
      JSON.stringify(field?.formattedValue),
      JSON.stringify(
        [...(validations || []), ...(asyncValidations || [])]?.reduce<any>(
          (acc, cur) => [...acc, ...(cur.deps || []), cur.message],
          [],
        ),
      ),
    ],
  );
  /* eslint-enable */

  useEffect(
    () => () => {
      isMountedRef.current = false;
    },
    [],
  );

  return {
    ...getExposedField({
      field: field || getDefaultField(name),
      formId: form.id,
      formResetKey: form.resetKey,
      isSubmitted,
    }),
    setValue,
    otherProps,
  };
};
