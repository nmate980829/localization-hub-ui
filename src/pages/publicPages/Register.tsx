import * as React from 'react';
import {
  Center,
  Spacer,
} from "@chakra-ui/react";
import { RegisterForm } from '../../forms/Register';

export const RegisterPage = () => (
  <Center w="100%" h="100%" flexDirection="column">
    <Spacer/>
    <RegisterForm />
    <Spacer/>
    <Spacer/>
  </Center>
);