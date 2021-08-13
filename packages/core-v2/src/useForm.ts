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
  const useStoreRef = useContext(FormizContext);
  const selectorRef = useRef<(state: State) => any>();
  selectorRef.current = selector;

  const connectedStoreRef = useRef<UseStore<State>>();
  const exposedActions = useStoreRef?.current?.((s) => s.exposedActions);
  const state = useStoreRef?.current?.((s) => selector(s));
  const [connectedExposedActions, setConnectedExposedActions] = useState(
    defaultExposedActions,
  );
  const [connectedState, setConnectedState] = useState();

  const connect = useCallback(
    (storeRef) => {
      if (useStoreRef) return;
      connectedStoreRef.current = storeRef.current;
      setConnectedExposedActions(storeRef.current.getState().exposedActions);

      // This is not working
      setConnectedState(selectorRef.current?.(storeRef.current.getState()));
    },
    [useStoreRef],
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
