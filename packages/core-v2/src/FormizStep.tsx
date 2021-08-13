import React, { useCallback, useContext, useEffect, useRef } from 'react';
import shallow from 'zustand/shallow';
import { FormizContext } from './Formiz';
import { FormizStepProps, StepStateInStep } from './types';

export const FormizStepContext = React.createContext<any>({});

export const FormizStep: React.FC<FormizStepProps> = ({
  as: Tag = 'fieldset',
  children,
  name,
  label,
  order = 0,
  isEnabled = true,
  style = {},
  ...rest
}) => {
  const useStoreRef = useContext(FormizContext);
  const nameRef = useRef<string>(name);
  nameRef.current = name;

  if (!useStoreRef || !useStoreRef.current) {
    throw new Error('TODO');
  }

  const { registerStep, unregisterStep, updateStep } = useStoreRef.current(
    useCallback((state) => state.internalActions, []),
  );
  const step = useStoreRef.current<StepStateInStep>(
    useCallback(
      ({ steps }): StepStateInStep => {
        const currentStep = steps.find((s) => s.name === name);
        return currentStep ? { isActive: currentStep.isActive } : undefined;
      },
      [name],
    ),
    shallow,
  );

  // Register / Unregister Step
  useEffect(() => {
    registerStep(name);
    return () => {
      unregisterStep(name);
    };
  }, [registerStep, unregisterStep, name]);

  // Update Step
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
          display: !step?.isActive ? 'none' : null,
        }}
        {...rest}
      >
        {isEnabled && children}
      </Tag>
    </FormizStepContext.Provider>
  );
};
