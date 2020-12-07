import React from 'react';
import { useForm } from '@formiz/core-v2';
import { Box } from '@chakra-ui/react';

export const DebugV2 = () => {
  const { state } = useForm((s) => s);

  return (
    <Box data-test="debug" as="pre" fontSize="xs" flex="1">
      <Box fontSize="sm" color="gray.400">
        # Debug useForm()
      </Box>
      {JSON.stringify(state, null, 2)}
    </Box>
  );
};
