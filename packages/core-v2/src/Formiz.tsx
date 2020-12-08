import React, { useRef, useEffect } from 'react';
import { getFormUniqueId } from './utils/ids.utils';
import { FormizContextType, FormProps, State } from './types';
import { createStore } from './store';
import { UseStore } from 'zustand';

export const FormizContext = React.createContext<FormizContextType>(null);

export const Formiz = ({
  children = null,
  connect,
  id = getFormUniqueId(),
}: FormProps) => {
  const useStoreRef = useRef<UseStore<State>>();
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
