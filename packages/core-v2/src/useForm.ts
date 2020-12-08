import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import { UseStore } from 'zustand';
import shallow from 'zustand/shallow';
import { State } from './types';
import { FormizContext } from './Formiz';

export const useForm = (
  selector = (state: Omit<State, 'actions'>): any => {},
) => {
  const ctx = useContext(FormizContext);
  const connectedStoreRef = useRef<UseStore<State>>();
  const selectorRef = useRef<(state: Omit<State, 'actions'>) => any>();
  selectorRef.current = selector;

  const actions = ctx?.useStore((s) => s.actions);
  const state = ctx?.useStore((s) => selector(omit(s, 'actions')));
  const [connectedActions, setConnectedActions] = useState(); // TODO Default actions
  const [connectedState, setConnectedState] = useState();

  const connect = useCallback(
    (store) => {
      if (ctx) return;
      connectedStoreRef.current = store;
      setConnectedActions(store.getState().actions);
      setConnectedState(
        selectorRef.current?.(omit(store.getState(), 'actions')),
      );
    },
    [ctx],
  );

  useEffect(
    () =>
      connectedStoreRef.current?.subscribe(
        (s: any) => {
          setConnectedState(s);
        },
        (s) => selectorRef.current?.(omit(s, 'actions')),
        shallow,
      ),
    [],
  );

  return {
    connect,
    ...(actions || connectedActions),
    state: state || connectedState,
  };
};
