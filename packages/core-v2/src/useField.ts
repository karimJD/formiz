import { useCallback, useContext, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import {
  UseFieldValues,
  FieldState,
  FieldErrors,
  FieldAsyncValidationObject,
  FieldProps,
  FieldValidationObject,
} from './types';
import { FormizContext } from './Formiz';
import { getDefaultField, getExposedField } from './utils/form.utils';

export const useField = ({
  name,
  debounce = 0,
  validations = [],
  asyncValidations = [],
}: FieldProps): UseFieldValues => {
  const isMountedRef = useRef(true);
  const ctx = useContext(FormizContext);

  if (!ctx) {
    throw new Error('TODO');
  }

  const { useStore } = ctx;

  const field = useStore(
    useCallback((state) => state.fields?.find((f) => f.name === name), [name]),
    shallow,
  );
  const { registerField, unregisterField, updateField } = useStore(
    useCallback((state) => state.actions, []),
  );

  const fieldRef = useRef<FieldState>();
  fieldRef.current = field;
  const debounceRef = useRef<number>();
  debounceRef.current = debounce;
  const validationsRef = useRef<FieldValidationObject[]>();
  validationsRef.current = validations;
  const asyncValidationsRef = useRef<FieldAsyncValidationObject[]>();
  asyncValidationsRef.current = asyncValidations;

  const setValue = useCallback(
    (newValue) => {
      if (!field?.id) return;
      console.log('setValue');
      updateField(field.id, { name, value: newValue });
    },
    [field?.id, name, updateField],
  );

  // Register / Unregister Field
  useEffect(() => {
    registerField(name);
    return () => {
      if (fieldRef.current?.id) {
        unregisterField(fieldRef.current.id);
      }
    };
  }, [registerField, unregisterField, name]);

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
            !validation.rule(field?.value)
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
              const isValid = await validation.rule(field.value);
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

      if (!debounceRef.current) {
        validateField();
        return () => {};
      }

      const timer = setTimeout(() => {
        validateField();
      }, debounceRef.current);
      return () => clearTimeout(timer);
    },
    /* eslint-disable react-hooks/exhaustive-deps */
    [
      field?.id,
      JSON.stringify(field?.value),
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
    ...getExposedField(field || getDefaultField(name)),
    setValue,
  };
};
