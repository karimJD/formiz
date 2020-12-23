import React, { useState, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { Formiz, useForm } from '@formiz/core-v2';
import { Button, Flex, Stack, IconButton, Box } from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { AddPlaceholder } from '../components/AddPlaceholder';
import { PageLayout } from '../layout/PageLayout';
import { useToastValues } from '../hooks/useToastValues';

const defaultCollection = [
  {
    id: uuid(),
    name: 'Default name',
  },
  {
    id: uuid(),
  },
];

export const Repeater = () => {
  const form = useForm((s) => s.form);
  const toastValues = useToastValues();
  const [collection, setCollection] = useState(defaultCollection);

  useEffect(() => {
    setCollection(defaultCollection);
  }, [form.state?.resetKey]);

  const handleSubmit = (values) => {
    toastValues(values);
  };

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
      key={form.state?.resetKey}
      connect={form.connect}
      onValidSubmit={handleSubmit}
      initialValues={{
        collection: [
          { company: 'Initial Company (1)' },
          { name: 'Initial Name (2)', company: 'Initial Company (2)' },
        ],
      }}
    >
      <PageLayout v2>
        <form noValidate onSubmit={form.submit}>
          <PageHeader githubPath="Repeater.js">Repeater</PageHeader>

          <pre>{JSON.stringify(form.state, null, 2)}</pre>

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

          <Flex mt="4">
            <Button
              type="submit"
              ml="auto"
              colorScheme="brand"
              isDisabled={!form.state?.isValid && form.state?.isSubmitted}
            >
              Submit
            </Button>
          </Flex>
        </form>
      </PageLayout>
    </Formiz>
  );
};
