import React from 'react';
import { AlertDialog, Button, HStack, Icon, Text, VStack, } from 'native-base';
import { Feather } from '@expo/vector-icons';

type DialogType = 'delete' | 'complete' | 'custom';

interface ConfirmationDialogProps{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  type?: DialogType;
  title?: string;
  bodyText?: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: string;
  iconColor?: string;
  confirmColor?: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  type = 'complete',
  title,
  bodyText,
  confirmText,
  cancelText = 'Cancel',
  iconName,
  iconColor,
  confirmColor,
  ...props
}) => {
  const cancelRef = React.useRef(null);

  const dialogConfigs = {
    delete: {
      title: 'Delete Task',
      bodyText: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmText: 'Delete',
      iconName: 'trash-2',
      iconColor: 'primary.600',
      confirmColor: 'primary.600',
    },
    complete: {
      title: 'Complete Task',
      bodyText: 'Mark this task as completed and reset timer?',
      confirmText: 'Complete',
      iconName: 'check-circle',
      iconColor: 'primary.600',
      confirmColor: 'primary.600',
    },
    custom: {
      title: title || 'Confirm Action',
      bodyText: bodyText || 'Are you sure you want to perform this action?',
      confirmText: confirmText || 'Confirm',
      iconName: iconName || 'alert-circle',
      iconColor: iconColor || 'primary.600',
      confirmColor: confirmColor || 'primary.600',
    },
  };

  const config = dialogConfigs[type];

  return (
    <AlertDialog
      leastDestructiveRef={cancelRef}
      isOpen={isOpen}
      onClose={onClose}
      {...props}
    >
      <AlertDialog.Content bg="white" borderRadius="xl" mx={4}>
        <AlertDialog.Header borderBottomWidth={0} py={4} alignItems="center">
          <HStack space={2} alignItems="center">
            <Icon
              as={Feather}
              name={config.iconName}
              color={config.iconColor}
              size={6}
            />
            <Text fontSize="lg" fontWeight="bold">
              {config.title}
            </Text>
          </HStack>
        </AlertDialog.Header>
        <AlertDialog.Body py={4}>
          <Text textAlign="center">
            {config.bodyText}
          </Text>
        </AlertDialog.Body>
        <AlertDialog.Footer
          borderTopWidth={0}
          justifyContent="center"
          pb={4}
          pt={2}
        >
          <Button.Group space={3}>
            <Button
              variant="outline"
              colorScheme="coolGray"
              onPress={onClose}
              ref={cancelRef}
              px={6}
              _text={{ fontWeight: "medium" }}
            >
              {cancelText}
            </Button>
            <Button
              bg={config.confirmColor}
              _text={{ color: "white", fontWeight: "medium" }}
              _pressed={{ opacity: 0.8 }}
              px={6}
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              {config.confirmText}
            </Button>
          </Button.Group>
        </AlertDialog.Footer>
      </AlertDialog.Content>
    </AlertDialog>
  );
};

export default ConfirmationDialog;