import { useToast } from '@chakra-ui/react';

export const useAlert = () => {
  const toast = useToast() 
  const disabledAlert = () => toast({
    title: 'This action cannot be performed',
    description: 'You lack the rights to do so',
    isClosable: true,
    position: 'top',
    status: 'error'
  });
  const loadAlert = () => toast({
    title: 'Item cannot be loaded',
    description: 'Try to refresh',
    isClosable: true,
    position: 'top',
    status: 'error'
  });
  const success = (text: string) => toast({
    title: text,
    isClosable: true,
    status: 'success',
    position: 'top',
    duration: 5000,
  });
  const error = (text: string) => toast({
    title: text,
    isClosable: true,
    status: 'error',
    position: 'top',
  });
  return {
    disabledAlert,
    loadAlert,
    success,
    error,
  };
}

