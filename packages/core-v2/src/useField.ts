import { useCallback, useContext, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { FormizContext } from './Formiz';

export const useField = (props: any) => {
  const { name } = props;
  const { useStore } = useContext(FormizContext);
  const field = useStore(
    useCallback(
      (state: any) => state.fields?.find((x: any) => x.name === name),
      [name],
    ),
    shallow,
  );
  const fieldRef = useRef<any>();
  fieldRef.current = field;
  const { registerField, unregisterField, updateField } = useStore(
    useCallback((state: any) => state.actions, []),
  );

  const setValue = useCallback(
    (newValue) => {
      updateField({ id: field?.id, name, value: newValue });
    },
    [field?.id, name, updateField],
  );

  useEffect(() => {
    registerField(name);
    return () => {
      unregisterField(fieldRef.current?.id);
    };
  }, [registerField, unregisterField, name]);

  return { value: field?.value, setValue };
};
