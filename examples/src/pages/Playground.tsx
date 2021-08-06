import React, { useState, useEffect } from 'react';
import { Formiz, useForm } from '@formiz/core';
import { isEmail } from '@formiz/validations';
import { v4 as uuid } from 'uuid';
import {
  Button, Flex, Box, IconButton, Stack, ButtonGroup,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { useToastValues } from '../hooks/useToastValues';
import { PageLayout } from '../layout/PageLayout';
import { FieldUpload } from '../components/Fields/FieldUpload';
import { AddPlaceholder } from '../components/AddPlaceholder';

const defaultCollection: any = [
  { id: '1', company: 'Initial Company (1)' },
  { id: '2', name: 'Initial Name (2)', company: 'Initial Company (2)' },
];

export const Playground = () => {
  const form = useForm();
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);

    form.invalidateFields({
      name: 'You can display an error after an API call',
    });
  };

  const [collection, setCollection] = useState(defaultCollection);

  useEffect(() => {
    setCollection(defaultCollection);
  }, [form.resetKey]);

  const addItem = () => {
    setCollection((c) => [
      ...c,
      {
        id: uuid(),
      },
    ]);
  };

  const addItemAtIndex = (index) => {
    setCollection((c) => [
      ...c.slice(0, index + 1),
      {
        id: uuid(),
      },
      ...c.slice(index + 1),
    ]);
  };

  const removeItem = (id) => {
    setCollection((c) => c.filter((x) => x.id !== id));
  };

  return (
    <Formiz
      connect={form}
      onValidSubmit={handleSubmit}
      autoForm
      initialValues={{
        unused: 'test',
        name: 'Name',
        companyObj: { name: 'company' },
        collection: [
          { id: '1', company: 'Initial Company (1)' },
          { id: '2', name: 'Initial Name (2)', company: 'Initial Company (2)' },
        ],
      }}
    >
      <PageLayout>
        <PageHeader githubPath="Playground.tsx">Playground</PageHeader>
        <FieldInput
          name="name"
          label="Name"
          required="Required"
          formatValue={(val) => (val || '').trim()}
        />
        <FieldInput
          name="email"
          label="Email"
          type="email"
          formatValue={(val) => (val || '').trim()}
          required="Required"
          validations={[
            {
              rule: isEmail(),
              message: 'Not a valid email',
            },
          ]}
          asyncValidations={[
            {
              rule: async (value) => new Promise((resolve) => setTimeout(() => {
                resolve((value || '').toLowerCase() === 'john@company.com');
              }, 1000)),
              message: 'Email already used. Try john@company.com',
            },
          ]}
        >
          <Button
            size="sm"
            variant="link"
            onClick={() => form.setFieldsValues({
              email: 'john@company.com',
            })}
          >
            Fill with john@company.com
          </Button>
        </FieldInput>
        <FieldInput
          name="company"
          label="Company"
          formatValue={(val) => (val || '').trim()}
        />
        {['a1', 'a2', 'a3'].includes(form.values?.company) && (
          <FieldInput
            name="companyObj.name"
            label="Company Name"
            formatValue={(val) => (val || '').trim()}
          />
        )}
        <FieldUpload name="file" label="File" />
        <Box>
          {collection.map(({ id, name }, index) => (
            <Stack
              key={id}
              direction="row"
              spacing="4"
              mb="6"
              data-test={`repeater-item[${index}]`}
            >
              <Box transform="translateY(4rem)">
                <IconButton
                  aria-label="Add"
                  icon={<AddIcon />}
                  size="sm"
                  onClick={() => addItemAtIndex(index)}
                  variant="ghost"
                  isDisabled={collection.length > 20}
                  pointerEvents={
                    index + 1 >= collection.length ? 'none' : undefined
                  }
                  opacity={index + 1 >= collection.length ? 0 : undefined}
                />
              </Box>
              <Box flex="1">
                <FieldInput
                  name={`collection[${index}].name`}
                  defaultValue={name}
                  label="Name"
                  required="Required"
                  m="0"
                />
              </Box>
              <Box flex="1">
                <FieldInput
                  name={`collection[${index}].company`}
                  label="Company"
                  m="0"
                />
              </Box>
              <Box pt="1.75rem">
                <IconButton
                  aria-label="Delete"
                  icon={<DeleteIcon />}
                  onClick={() => removeItem(id)}
                  variant="ghost"
                />
              </Box>
            </Stack>
          ))}
        </Box>

        {collection.length <= 20 && (
          <AddPlaceholder label="Add member" onClick={addItem} />
        )}
        <ButtonGroup>
          <Button onClick={() => form.setFieldsValues({ company: 'a0', companyObj: { name: 'b0' } }, { keepUnmounted: true })}>
            0
          </Button>
          <Button onClick={() => form.setFieldsValues({ company: 'a1', companyObj: { name: 'b1' } }, { keepUnmounted: true })}>
            1
          </Button>
          <Button onClick={() => form.setFieldsValues({ company: 'a2', 'companyObj.name': 'b2' }, { keepUnmounted: true })}>
            2
          </Button>
          <Button onClick={() => form.setFieldsValues({ company: 'a3' }, { keepUnmounted: true })}>
            3
          </Button>
        </ButtonGroup>
        <Flex>
          <Button
            type="submit"
            ml="auto"
            colorScheme="brand"
            isDisabled={
              (!form.isValid || form.isValidating) && form.isSubmitted
            }
          >
            Submit
          </Button>
        </Flex>
      </PageLayout>
    </Formiz>
  );
};
