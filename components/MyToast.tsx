import { Box, Text } from "native-base";
import React from "react";

type ToastStatus = 'success' | 'error' | 'warning' | 'info';

interface MyToastProps {
  title: string;
  description?: string;
  status: ToastStatus;
}

const statusColors = {
  success: 'green.400',
  error: 'red.400',
  warning: 'yellow.500',
  info: 'blue.500',
};

export const MyToast: React.FC<MyToastProps> = ({ title, description, status }) => {
  return (
    <Box bg={statusColors[status]} px="4" py="3" rounded="sm" mb={5} shadow={2}>
      <Text color="white" fontWeight="bold" fontSize="md">
        {title}
      </Text>
      {description && (
        <Text color="white" fontSize="sm" opacity={0.8}>
          {description}
        </Text>
      )}
    </Box>
  );
};