import React, { useCallback, useContext, useEffect } from 'react';
import { useRef } from 'react';
import { FormizContext } from './Formiz';
import { FormizStepProps } from './types';

export const FormizStepContext = React.createContext<any>({});

export const FormizStep: React.FC<FormizStepProps> = ({
  as: Tag = 'fieldset',
  children,
  name,
  label,
  order,
  isEnabled = true,
  style = {},
  ...rest
}) => {
  const formizContext = useContext(FormizContext);
  const nameRef = useRef<string>(name);
  nameRef.current = name;

  if (!formizContext) {
    throw new Error('TODO');
  }

  const { useStore } = formizContext;
  const { registerStep, unregisterStep, updateStep } = useStore(
    useCallback((state) => state.internalActions, []),
  );
  const isActive = true;

  // Register / Unregister Step
  useEffect(() => {
    registerStep(name);
    return () => {
      unregisterStep(name);
    };
  }, [registerStep, unregisterStep, name]);

  useEffect(() => {
    updateStep(nameRef.current, { isEnabled, label, order });
  }, [updateStep, isEnabled, label, order]);

  return (
    <FormizStepContext.Provider
      value={{
        name,
      }}
    >
      <Tag
        style={{
          ...style,
          display: !isActive ? 'none' : null,
        }}
        {...rest}
      >
        {isEnabled && children}
      </Tag>
    </FormizStepContext.Provider>
  );
};
