import React, { useLayoutEffect, useRef } from 'react';

import { Formiz, useForm, useField } from '@formiz/core-v2';
import {
  Code,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Stack,
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
  const { value, isValid, errorMessage, setValue } = useField(props);
  const { label, name } = props;
  return (
    <FormControl id={name} isInvalid={!isValid}>
      <FormLabel>
        {label}
        <DebugRender />
      </FormLabel>
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
      />
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
  const { connect, state } = useForm((s) => s.form);
  return (
    <Formiz connect={connect}>
      <PageLayout v2>
        <PageHeader githubPath="Playground.js">
          Playground
          <DebugRender />
        </PageHeader>
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
          <Field label="Lastname" name="lastname" />
          <pre>{JSON.stringify(state || {}, null, 2)}</pre>
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
        </Stack>
      </PageLayout>
    </Formiz>
  );
};
