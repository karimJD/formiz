import React, { useCallback, useContext, useEffect } from 'react';
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

  if (!formizContext) {
    throw new Error('TODO');
  }

  const { useStore } = formizContext;
  const { registerStep, unregisterStep } = useStore(
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
