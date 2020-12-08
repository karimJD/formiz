import create from 'zustand';
import { Field, State } from './types';
import { getFieldUniqueId } from './utils/ids.utils';

const getDefaultField = (name: string): Field => ({
  id: getFieldUniqueId(),
  name,
  value: null,
  errors: [],
  asyncErrors: [],
  isValidating: false,
});

export const createStore = (id: string) =>
  create<State>((set, get) => ({
    form: {
      id,
      resetKey: 0,
      isValid: true,
      isValidating: false,
      isSubmitted: false,
      isStepValid: true,
      isStepValidating: false,
      isStepSubmitted: false,
    },
    fields: [],
    actions: {
      registerField(name, defaultField) {
        set((state) => {
          const fields = [
            ...state.fields,
            {
              ...getDefaultField(name),
              ...(defaultField || {}),
            },
          ];
          const form = {
            ...state.form,
            isValid: fields.every((f) => !!f.value),
          };
          return {
            form,
            fields,
          };
        });
      },
      unregisterField(id) {
        set((state) => {
          const fields = state.fields.filter((f) => f.id !== id);
          const form = {
            ...state.form,
            isValid: fields.every((f) => !!f.value),
          };
          return {
            form,
            fields,
          };
        });
      },
      updateField(id, field) {
        set((state) => {
          if (!id) return {};

          const oldField = state.fields.find((f) => f.id === id);

          if (!oldField) return {};

          const otherFields = state.fields.filter((f) => f.id !== id);
          const fields = [
            ...otherFields,
            {
              ...(oldField || {}),
              ...field,
            },
          ];
          const form = {
            ...state.form,
            isValid: fields.every((f) => !!f.value),
          };
          return {
            form,
            fields,
          };
        });
      },
    },
  }));
