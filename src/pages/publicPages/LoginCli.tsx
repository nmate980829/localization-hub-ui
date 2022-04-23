import * as React from 'react';
import {
  Center,
  Spacer,
} from "@chakra-ui/react";
import { LoginForm } from '../../forms/Login';
import { useNoUser } from '../../hooks/useNoUser';
import { LoginCliForm } from '../../forms/LoginCli';

export const LoginCliPage = () => {
  return (
    <Center w="100%" h="100%" flexDirection="column">
      <Spacer/>
      <LoginCliForm />
      <Spacer/>
      <Spacer/>
    </Center>
  );
}