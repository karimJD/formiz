import React, { useLayoutEffect, useRef } from 'react';
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Text,
  Code,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

const DebugRender = () => {
  const renderCountRef = useRef(0);

  useLayoutEffect(() => {
    renderCountRef.current = renderCountRef.current + 1;
  });

  return (
    <Code position="absolute" top="0" right="0">
      {renderCountRef.current}
    </Code>
  );
};

export const FormGroup = ({
  children,
  errorMessage,
  helper,
  id,
  isRequired,
  label,
  showError,
  ...props
}) => (
  <FormControl mb="6" isInvalid={showError} isRequired={isRequired} {...props}>
    <DebugRender />
    {!!label && <FormLabel htmlFor={id}>{label}</FormLabel>}
    {!!helper && (
      <Text color="gray.500" fontSize="sm" mt="0" mb="3">
        {helper}
      </Text>
    )}
    {children}
    <FormErrorMessage id={`${id}-error`}>
      <WarningIcon mr="2" />
      {errorMessage}
    </FormErrorMessage>
  </FormControl>
);
