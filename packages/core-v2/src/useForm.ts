import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UseStore } from 'zustand';
import shallow from 'zustand/shallow';
import { State, FormExposedActions, UseFormValues } from './types';
import { FormizContext } from './Formiz';

export const defaultExposedActions: FormExposedActions = {
  submit: () => {},
  setFieldsValues: () => {},
  setFieldsErrors: () => {},
  getFieldStepName: () => '',
  submitStep: () => {},
  goToStep: () => {},
  nextStep: () => {},
  prevStep: () => {},
  reset: () => {},
};

export const useForm = (
  selector = (state: State): any => {},
): UseFormValues => {
  const ctx = useContext(FormizContext);
  const selectorRef = useRef<(state: State) => any>();
  selectorRef.current = selector;

  const connectedStoreRef = useRef<UseStore<State>>();
  const exposedActions = ctx?.useStore((s) => s.exposedActions);
  const state = ctx?.useStore((s) => selector(s));
  const [connectedExposedActions, setConnectedExposedActions] = useState(
    defaultExposedActions,
  );
  const [connectedState, setConnectedState] = useState();

  const connect = useCallback(
    (store) => {
      if (ctx) return;
      connectedStoreRef.current = store;
      setConnectedExposedActions(store.getState().exposedActions);
      setConnectedState(selectorRef.current?.(store.getState()));
    },
    [ctx],
  );

  useEffect(() => {
    const unsub = connectedStoreRef.current?.subscribe(
      (s: any) => {
        setConnectedState(s);
      },
      (s) => selectorRef.current?.(s),
      shallow,
    );
    return () => unsub && unsub();
  }, [connectedStoreRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    connect,
    ...(exposedActions || connectedExposedActions),
    state: state || connectedState,
  };
};
