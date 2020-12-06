import React, { useLayoutEffect, useRef } from 'react';

import { Formiz, useForm, useField } from '@formiz/core-v2';
import {
  Box,
  Code,
  Divider,
  FormControl,
  FormLabel,
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
  const { value, setValue } = useField(props);
  const { label, name } = props;
  return (
    <FormControl id={name}>
      <FormLabel>
        {label}
        <DebugRender />
      </FormLabel>
      <Input
        type="text"
        value={value ?? ''}
        onChange={(e) => setValue(e.target.value)}
      />
    </FormControl>
  );
};

const DebugState = () => {
  const { state } = useForm((s) => s);
  return (
    <>
      <Box as="pre" position="relative">
        <DebugRender />
        {JSON.stringify(state || {}, null, 2)}
      </Box>
    </>
  );
};

export const Playground = () => {
  const { connect, state } = useForm((s) => s.form);
  return (
    <PageLayout>
      <PageHeader githubPath="Playground.js">
        Playground
        <DebugRender />
      </PageHeader>
      <Formiz connect={connect}>
        <Stack spacing="6">
          <Field label="Firstname" name="firstname" />
          <Field label="Lastname" name="lastname" />
          <DebugState />
          <Divider />
          <pre>{JSON.stringify(state || {}, null, 2)}</pre>
          {[...Array(1)].map((_x, index) => (
            <Field
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              name={`user[${index}].email`}
            />
          ))}
        </Stack>
      </Formiz>
    </PageLayout>
  );
};
