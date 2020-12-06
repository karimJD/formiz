import { useCallback, useContext } from 'react';
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
  const { setField } = useStore(useCallback((state: any) => state.actions, []));

  const setValue = useCallback(
    (newValue) => {
      setField({ name, value: newValue });
    },
    [name, setField],
  );

  return { value: field?.value, setValue };
};
