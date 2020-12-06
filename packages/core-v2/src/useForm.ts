import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import omit from 'lodash/omit';
import shallow from 'zustand/shallow';
import { FormizContext } from './Formiz';

export const useForm = (selector = (s: any): any => {}) => {
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
          console.log('react');
          setState(omit(s, 'actions'));
        },
        selectorRef.current,
        shallow,
      ),
    [selectorRef],
  );

  return { connect, ...actions, state };
};
