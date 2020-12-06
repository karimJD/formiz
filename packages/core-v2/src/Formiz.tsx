import React, { useRef, useEffect } from 'react';
import create from 'zustand';

export const FormizContext = React.createContext<any>(null);
export const Formiz = ({ connect, ...rest }: any) => {
  const useStoreRef = useRef<any>();
  if (!useStoreRef.current) {
    useStoreRef.current = create((set, get) => ({
      form: {
        isValid: true,
      },
      fields: [],
      actions: {
        setField(field: any) {
          set((state: any) => {
            const oldField =
              state.fields.find((x: any) => x.name === field.name) || {};
            const otherFields = state.fields.filter(
              (x: any) => x.name !== field.name,
            );
            const fields = [...otherFields, { ...oldField, ...field }];
            const form = {
              ...state.form,
              isValid: fields.every((x: any) => !!x.value),
            };
            return {
              form,
              fields,
            };
          });
        },
      },
    }));
  }

  useEffect(() => {
    if (connect) {
      console.log('connect');
      connect(useStoreRef.current);
    }
  }, [connect]);

  return (
    <FormizContext.Provider
      value={{ useStore: useStoreRef.current }}
      {...rest}
    />
  );
};
