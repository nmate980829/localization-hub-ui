import * as React from 'react';
import {
  Flex, Heading,
} from "@chakra-ui/react";
import { Access, SERVERROLE as Role } from '../../client';
import { useRole } from '../../hooks/useRole';
import { UserView } from '../../components/views/User';
import { AccessItem } from '../../components/items/Access';
import { useApi } from '../../hooks/useApi';
import { useStores } from '../../stores';
import { useAlert } from '../../hooks/useAlert';
import { Confirm } from '../../components/Confirm';
import { useParams } from 'react-router-dom';
import { RoleView } from '../../components/views/Role';

export const RolePage = () => {
  let id = Number.parseInt(useParams<{id: string}>().id);

  
  return (
    <Flex w="100%" pt={6} pb={12} h="95%" flexDirection="column" justify="flex-start" align="center" overflowX="hidden" overflowY="auto"
      sx={{
        '&::-webkit-scrollbar': {
          width: '16px',
          borderRadius: '8px',
          backgroundColor: `rgba(255, 255, 255, 0.2)`,
        },'&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: `rgba(0, 0, 0, 0.3)`,
          borderRadius: '8px',

        },
      }}
      >
      <RoleView />
    </Flex>
  );
}