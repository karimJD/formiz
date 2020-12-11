import React, { useRef, useEffect } from 'react';
import { getFormUniqueId } from './utils/ids.utils';
import { FormizContextType, FormizProps, State } from './types';
import { createStore } from './store';
import { UseStore } from 'zustand';

export const FormizContext = React.createContext<FormizContextType>(null);

export const Formiz: React.FC<FormizProps> = ({
  children = null,
  connect,
  id = getFormUniqueId(),
  initialValues = {},
  onSubmit = () => {},
  onValidSubmit = () => {},
  onInvalidSubmit = () => {},
}) => {
  const useStoreRef = useRef<UseStore<State>>();

  const initialValuesRef = useRef<FormizProps['initialValues']>();
  initialValuesRef.current = initialValues;
  const onSubmitRef = useRef<FormizProps['onSubmit']>();
  onSubmitRef.current = onSubmit;
  const onValidSubmitRef = useRef<FormizProps['onValidSubmit']>();
  onValidSubmitRef.current = onValidSubmit;
  const onInvalidSubmitRef = useRef<FormizProps['onInvalidSubmit']>();
  onInvalidSubmitRef.current = onInvalidSubmit;

  if (!useStoreRef.current) {
    useStoreRef.current = createStore({
      formId: id,
      initialValuesRef,
      onSubmitRef,
      onValidSubmitRef,
      onInvalidSubmitRef,
    });
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
