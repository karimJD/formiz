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
import { getFieldUniqueId } from './utils/ids.utils';

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
  const fieldIdRef = useRef(getFieldUniqueId());
  const nameRef = useRef(name);
  nameRef.current = name;
  const useStoreRef = useContext(FormizContext);

  if (!useStoreRef || !useStoreRef.current) {
    throw new Error('TODO');
  }

  const formizStepContext = useContext(FormizStepContext);
  const stepName = formizStepContext?.name;
  const stepNameRef = useRef(stepName);
  stepNameRef.current = stepName;

  const field = useStoreRef.current(
    useCallback(
      (state) => state.fields?.find((f) => f.id === fieldIdRef.current),
      [],
    ),
    shallow,
  );
  const form = useStoreRef.current<FormStateInField>(
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
  const step = useStoreRef.current<StepStateInField>(
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
  const { registerField, unregisterField, updateField } = useStoreRef.current(
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

  const fieldId = field?.id;
  const setValue = useCallback(
    (value) => {
      if (!fieldId) return;
      updateField(fieldId, {
        name,
        value,
        formattedValue: formatValueRef.current?.(value),
        externalErrors: [],
        isPristine: false,
      });
    },
    [fieldId, name, updateField],
  );

  // Register / Unregister Field
  useEffect(() => {
    const fieldId = fieldIdRef.current;
    registerField(fieldId, {
      name: nameRef.current,
      stepName: stepNameRef.current,
      initialValue: formatValueRef.current?.(defaultValueRef.current),
    });
    return () => {
      if (fieldId) {
        unregisterField(fieldId);
      }
    };
  }, [registerField, unregisterField]);

  // Update field
  useEffect(() => {
    updateField(fieldIdRef.current, {
      name: name,
      stepName: stepName,
    });
  }, [updateField, name, stepName]);

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
