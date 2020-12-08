import React from 'react';
import { FormizStepProps } from './types';

export const FormizStepContext = React.createContext<any>({});

export const FormizStep: React.FC<FormizStepProps> = ({
  as: Tag = 'div',
  children,
  name,
  label,
  order,
  isEnabled = true,
  style = {},
  ...rest
}) => {
  const isActive = true;

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
