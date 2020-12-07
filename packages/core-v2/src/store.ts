import create from 'zustand';
import { Field, State } from './types';
import { getFieldUniqueId } from './utils/ids';

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
      registerField(name: string) {
        set((state) => {
          const fields = [
            ...state.fields,
            {
              id: getFieldUniqueId(),
              name,
              value: '',
            },
          ];
          const form = {
            ...state.form,
            isValid: fields.every((f: Field) => !!f.value),
          };
          return {
            form,
            fields,
          };
        });
      },
      unregisterField(id: string) {
        set((state) => {
          const fields = state.fields.filter((f: Field) => f.id !== id);
          const form = {
            ...state.form,
            isValid: fields.every((f: Field) => !!f.value),
          };
          return {
            form,
            fields,
          };
        });
      },
      updateField(field: Field) {
        set((state) => {
          const oldField =
            state.fields.find((f: Field) => f.id === field.id) || {};
          const otherFields = state.fields.filter(
            (f: Field) => f.id !== field.id,
          );
          const fields = [...otherFields, { ...oldField, ...field }];
          const form = {
            ...state.form,
            isValid: fields.every((f: Field) => !!f.value),
          };
          return {
            form,
            fields,
          };
        });
      },
    },
  }));
