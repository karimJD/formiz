import React from 'react';
import { Formiz, useForm, FormizStep } from '@formiz/core-v2';
import { isEmail } from '@formiz/validations';
import { Button, Grid, Box } from '@chakra-ui/react';
import { FieldInput } from '../components/Fields/FieldInput';
// import { FieldSelect } from '../components/Fields/FieldSelect';
import { PageHeader } from '../components/PageHeader';
import { useToastValues } from '../hooks/useToastValues';
import { PageLayout } from '../layout/PageLayout';

const FIELDS_BY_STEP = 20;

export const LotOfFields = () => {
  const form = useForm((s) => null);
  const toastValues = useToastValues();

  const handleSubmit = (values) => {
    toastValues(values);

    form.setFieldsErrors({
      'name-0': 'You can display an error after an API call',
    });
    const stepWithError = form.getFieldStepName('name-0');
    if (stepWithError) {
      form.goToStep(stepWithError);
    }
  };

  return (
    <Formiz connect={form.connect} onValidSubmit={handleSubmit}>
      <PageLayout v2>
        <form noValidate onSubmit={form.submitStep}>
          <PageHeader githubPath="LotOfFields.js">Lot of fields</PageHeader>
          <FormizStep name="step1">
            {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
              <FieldInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                name={`user[${index}].name`}
                label={`Name ${index}`}
                defaultValue="John"
                required="Required"
              />
            ))}
          </FormizStep>
          <FormizStep name="step2">
            {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
              <FieldInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                name={`user[${index}].email`}
                label={`Email ${index}`}
                defaultValue="john@doe.com"
                required="Required"
                validations={[
                  {
                    rule: isEmail(),
                    message: 'Not a valid email',
                  },
                ]}
              />
            ))}
          </FormizStep>
          <FormizStep name="step3">
            {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
              <FieldInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                name={`user[${index}].company`}
                label={`Company ${index}`}
                defaultValue="Company co."
                required="Required"
              />
            ))}
          </FormizStep>
          <FormizStep name="step4">
            {[...Array(FIELDS_BY_STEP)].map((_x, index) => (
              <FieldInput
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                name={`user[${index}].country`}
                label={`Country ${index}`}
                required="Required"
                placeholder="Choose a country..."
              />
            ))}
          </FormizStep>
          {!!form?.state?.steps?.length && (
            <Grid templateColumns="1fr 2fr 1fr" alignItems="center">
              {!form?.state?.isFirstStep && (
                <Button gridColumn="1" onClick={form?.state?.prevStep}>
                  Previous
                </Button>
              )}
              <Box
                gridColumn="2"
                textAlign="center"
                fontSize="sm"
                color="gray.500"
              >
                Step {(form?.state?.currentStep?.index ?? 0) + 1} /{' '}
                {form?.state?.steps.length}
              </Box>
              <Button
                type="submit"
                gridColumn="3"
                colorScheme="brand"
                isDisabled={
                  form?.state?.isLastStep
                    ? !form?.state?.isValid && form?.state?.isSubmitted
                    : !form?.state?.isStepValid && form?.state?.isStepSubmitted
                }
              >
                {form?.state?.isLastStep ? 'Submit' : 'Next'}
              </Button>
            </Grid>
          )}
        </form>
      </PageLayout>
    </Formiz>
  );
};
