import * as React from 'react';
import {
  Center,
  Spacer,
} from "@chakra-ui/react";
import { LoginForm } from '../../forms/Login';
import { useNoUser } from '../../hooks/useNoUser';

export const LoginPage = () => {
  useNoUser();
  return (
    <Center w="100%" h="100%" flexDirection="column">
      <Spacer/>
      <LoginForm />
      <Spacer/>
      <Spacer/>
    </Center>
  );
}