import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import shallow from 'zustand/shallow';
import { FormizContext } from './Formiz';

export const useForm = (selector = (s: any): any => {}) => {
  const ctx = useContext(FormizContext);
  const connectedStoreRef = useRef<any>();
  const selectorRef = useRef<any>();
  selectorRef.current = selector;

  const actions = ctx?.useStore((s: any) => s.actions);
  const state = ctx?.useStore((s: any) => selector(omit(s, 'actions')));
  const [connectedActions, setConnectedActions] = useState(); // TODO Default actions
  const [connectedState, setConnectedState] = useState();

  const connect = useCallback(
    (store) => {
      if (ctx) return;
      connectedStoreRef.current = store;
      setConnectedActions(store.getState().actions);
      setConnectedState(selectorRef.current(omit(store.getState(), 'actions')));
    },
    [ctx],
  );

  useEffect(
    () =>
      connectedStoreRef.current?.subscribe(
        (s: any) => {
          setConnectedState(s);
        },
        (s: any) => selectorRef.current(omit(s, 'actions')),
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
/*
export const _useForm = (selector = (s: any): any => {}) => {
  const ctx = useContext(FormizContext);
  const storeRef = useRef<any>();
  if (!storeRef.current && ctx) storeRef.current = ctx.useStore;
  const selectorRef = useRef<any>();
  selectorRef.current = selector;

  const [actions, setActions] = useState<any>(
    storeRef.current?.getState()?.actions,
  );
  const [state, setState] = useState<any>(
    selectorRef.current?.(omit(storeRef.current?.getState(), 'actions')),
  );

  if (ctx) {
    console.log(storeRef.current?.getState(), state);
  }

  const connect = useCallback(
    (store) => {
      storeRef.current = store;
      setActions(store.getState().actions);
      setState(selectorRef.current(omit(store.getState(), 'actions')));
    },
    [selectorRef],
  );

  useEffect(
    () =>
      storeRef.current?.subscribe(
        (s: any) => {
          setState(selectorRef.current(omit(s, 'actions')));
        },
        selectorRef.current,
        shallow,
      ),
    [selectorRef],
  );

  return { connect, ...actions, state };
};
*/
