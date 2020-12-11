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
  formattedValue: null,
  initialValue: null,
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
    value,
  },
  formId,
  formResetKey,
  isSubmitted,
}: {
  field: FieldState;
  formId: string;
  formResetKey: number;
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
    resetKey: formResetKey,
  };
};

const isObject = (x: any): boolean =>
  x && typeof x === 'object' && x.constructor === Object;

const parseValues = (values: any) =>
  Object.keys(values).reduce(
    (acc, key) => parseValuesName(key, acc), // eslint-disable-line
    values,
  );

const parseValuesName = (name: any, values: any): any => {
  if (name.indexOf('.') < 0 && name.indexOf('[') < 0) {
    return values;
  }

  const value = values[name];
  const { [name]: deletedKey, ...nextValues } = values || {};
  const [current, ...otherNames] = name.split('.');
  const isArraySyntax = current.match(/\[([0-9]*)\]$/g);

  if (isArraySyntax) {
    const [currentName, , currentIndex] = current.split(/(\[|\])/g);
    const currentCollection = values[currentName] || [];

    if (otherNames.length) {
      const group = {
        ...(values[currentName] && isObject(values[currentName][currentIndex])
          ? values[currentName][currentIndex]
          : {}),
        [otherNames.join('.')]: value,
      };

      currentCollection[currentIndex] = parseValues(group);
    } else {
      currentCollection[currentIndex] = value;
    }

    return {
      ...nextValues,
      [currentName]: currentCollection,
    };
  }

  const group = {
    ...(isObject(values[current]) ? values[current] : {}),
    [otherNames.join('.')]: value,
  };

  return {
    ...nextValues,
    [current]: parseValues(group),
  };
};

export const getFormFlatValues = (fields: FieldState[]) =>
  (fields || []).reduce(
    (obj, field) => ({
      ...obj,
      [field.name]: field.value,
    }),
    {},
  );

export const getFormValues = (fields: FieldState[]) => {
  const values = getFormFlatValues(fields || []);
  return parseValues(values);
};
