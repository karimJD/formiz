import React, { useLayoutEffect, useRef, useState } from 'react';

import { Formiz, FormizStep, useForm, useField } from '@formiz/core-v2';
import {
  Code,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
  Box,
  InputGroup,
  InputRightElement,
  Spinner,
  Button,
} from '@chakra-ui/react';

import { PageHeader } from '../components/PageHeader';
import { PageLayout } from '../layout/PageLayout';

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

const Field = (props) => {
  const {
    id,
    value,
    isValid,
    isValidating,
    isSubmitted,
    errorMessage,
    setValue,
  } = useField(props);
  const { label } = props;
  return (
    <FormControl id={id} isInvalid={!isValid && isSubmitted}>
      <FormLabel>
        {label}
        <DebugRender />
      </FormLabel>
      <InputGroup>
        <Input
          type="text"
          value={value ?? ''}
          onChange={(e) => setValue(e.target.value)}
        />
        {isValidating && (
          <InputRightElement>
            <Spinner size="sm" flex="none" />
          </InputRightElement>
        )}
      </InputGroup>
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};

// const DebugState = () => {
//   const { state } = useForm((s) => s);
//   return (
//     <>
//       <Box as="pre" position="relative">
//         <DebugRender />
//         {JSON.stringify(state || {}, null, 2)}
//       </Box>
//     </>
//   );
// };

export const Playground = () => {
  const [showStep, setShowStep] = useState(true);
  const {
    connect,
    reset,
    submitStep,
    goToStep,
    prevStep,
    nextStep,
    state,
  } = useForm((s) => s.form);
  const handleSubmit = (...args) => {
    console.log(...args);
  };
  return (
    <Formiz connect={connect} onValidSubmit={handleSubmit}>
      <PageLayout v2>
        <PageHeader githubPath="Playground.js">
          Playground
          <DebugRender />
        </PageHeader>
        <form onSubmit={submitStep}>
          <Button onClick={() => setShowStep((x) => !x)}>Toggle step</Button>
          <Button onClick={() => reset()}>Reset</Button>
          <Button onClick={() => goToStep('step2')}>Go step 2</Button>
          <Button onClick={() => goToStep('step3')}>Go step 3</Button>
          <Button onClick={() => prevStep()}>Prev</Button>
          <Button onClick={() => nextStep()}>Next</Button>
          <Stack spacing="6">
            <Field
              label="Firstname"
              name="firstname"
              validations={[
                {
                  rule: (value) => !!value,
                  message: 'Required',
                },
              ]}
              asyncValidations={[
                {
                  rule: async (value) =>
                    new Promise((r) =>
                      setTimeout(() => {
                        r(value === 'yes');
                      }, 2000),
                    ),
                  message: 'Async Required',
                },
              ]}
            />
            <FormizStep
              name="step2"
              style={{
                border: '1px dashed red',
                padding: '40px',
                position: 'relative',
              }}
            >
              <DebugRender />
              <Field
                label="Lastname"
                name="lastname"
                defaultValue="Test"
                validations={[
                  {
                    rule: (value) => !!value,
                    message: 'Required',
                  },
                ]}
              />
            </FormizStep>
            <Box
              as={FormizStep}
              name="step3"
              isEnabled={showStep}
              pos="relative"
              p="40px"
              border="1px dashed"
              borderColor="red.500"
            >
              <DebugRender />
              <Field
                label="Other"
                name="other"
                validations={[
                  {
                    rule: (value) => !!value,
                    message: 'Required',
                  },
                ]}
              />
            </Box>
            <pre>{JSON.stringify(state || {}, null, 2)}</pre>
            <Box
              as={FormizStep}
              name="step4"
              isEnabled={showStep}
              pos="relative"
              p="40px"
              border="1px dashed"
              borderColor="red.500"
            >
              {[...Array(1)].map((_x, index) => (
                <Field
                  key={index}
                  label={`Email ${index + 1}`}
                  name={`user[${index}].email`}
                  validations={[
                    {
                      rule: (value) => !!value,
                      message: 'Required',
                    },
                  ]}
                />
              ))}
            </Box>
            <Box>
              <Button type="submit">Submit</Button>
            </Box>
          </Stack>
        </form>
      </PageLayout>
    </Formiz>
  );
};
