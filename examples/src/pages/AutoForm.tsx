import React from 'react';
import { Formiz, useForm } from '@formiz/core-v2';
import { isEmail } from '@formiz/validations';
import { Button, Flex } from '@chakra-ui/react';
import { FieldInput } from '../components/Fields/FieldInput';
import { PageHeader } from '../components/PageHeader';
import { useToastValues } from '../hooks/useToastValues';
import { PageLayout } from '../layout/PageLayout';

const Footer = ({ ...rest }) => {
  const form = useForm((s) => s.form);
  return (
    <Flex {...rest}>
      <Button
        type="submit"
        ml="auto"
        colorScheme="brand"
        isDisabled={
          (!form.state?.isValid || form.state?.isValidating) &&
          form.state?.isSubmitted
        }
      >
        Submit
      </Button>
    </Flex>
  );
};

export const AutoForm = () => {
  const form = useForm();
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);

    form.setFieldsErrors({
      name: 'You can display an error after an API call',
    });
  };

  return (
    <Formiz connect={form.connect} onValidSubmit={handleSubmit} autoForm>
      <PageLayout v2>
        <PageHeader githubPath="AutoForm.js">Auto form</PageHeader>
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
              rule: async (value) =>
                new Promise((resolve) =>
                  setTimeout(() => {
                    resolve((value || '').toLowerCase() === 'john@company.com');
                  }, 1000),
                ),
              message: 'Email already used. Try john@company.com',
            },
          ]}
        >
          <Button
            size="sm"
            variant="link"
            onClick={() =>
              form.setFieldsValues({
                email: 'john@company.com',
              })
            }
          >
            Fill with john@company.com
          </Button>
        </FieldInput>
        <FieldInput
          name="company"
          label="Company"
          formatValue={(val) => (val || '').trim()}
        />
        <Footer />
      </PageLayout>
    </Formiz>
  );
};
