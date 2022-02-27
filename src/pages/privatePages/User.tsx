import * as React from 'react';
import {
  Flex,
} from "@chakra-ui/react";
import { UserResponseRoleEnum as Role } from '../../axiosClient';
import { useRole } from '../../hooks/useRole';
import { UserView } from '../../components/views/User';

export const UserPage = () => {
  useRole(Role.Hr);
  return (
    <Flex w="100%" h="100%" flexDirection="column" justify="center" align="center">
      <UserView />
    </Flex>
  );
}