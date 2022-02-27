import * as React from "react";

import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useColorModeValue } from '@chakra-ui/react';
import { ConfirmProps } from './types';
import { Invite } from '../axiosClient';

export const Confirm: React.FC<ConfirmProps> = ({ title, description, actionName, isOpen, onClose, action }) => {
  const cancelRef = React.useRef(null)
  return (
    <AlertDialog
      isOpen={isOpen}
      motionPreset="slideInBottom"
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {title}
          </AlertDialogHeader>
          <AlertDialogBody>
            {description}
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={action} ml={3}>
              {actionName}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>);
}