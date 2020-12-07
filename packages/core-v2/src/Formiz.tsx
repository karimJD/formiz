import React, { useRef, useEffect } from 'react';
import { getFormUniqueId } from './utils/ids';
import { FormProps } from './types';
import { createStore } from './store';

export const FormizContext = React.createContext<any>(null);

export const Formiz = ({
  children = null,
  connect,
  id = getFormUniqueId(),
}: FormProps) => {
  const useStoreRef = useRef<any>();
  if (!useStoreRef.current) {
    useStoreRef.current = createStore(id);
  }

  useEffect(() => {
    if (connect) {
      connect(useStoreRef.current);
    }
  }, [connect]);

  return (
    <FormizContext.Provider value={{ useStore: useStoreRef.current }}>
      {children}
    </FormizContext.Provider>
  );
};
