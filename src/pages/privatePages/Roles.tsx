import * as React from 'react';
import {
  Flex, Input, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/inputs/Search';
import { useApi } from '../../hooks/useApi';
import { Invite, Role, SERVERROLE} from '../../client';
import { InviteItem } from '../../components/items/Invite';
import { Confirm } from '../../components/Confirm';
import { AnimatePresence } from 'framer-motion';
import { CreateInvite } from '../../forms/CreateInvite';
import { useRole } from '../../hooks/useRole';
import { useStores } from '../../stores';
import { RoleItem } from '../../components/items/Role';
import { useAlert } from '../../hooks/useAlert';
import { CreateRole } from '../../forms/CreateRole';

export const RolesPage = () => {
  const [search, setSearch] = React.useState<string>('');
  const [roles, setRoles] = React.useState<Role[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {appStore} = useStores();
  const refresh = () => setRefresh(shouldRefresh + 1);

const {loadAlert} = useAlert();
  const {roleApi} = useApi();

  React.useEffect(() => {
    appStore.refresh();
    roleApi.rolesFindAll().then(response => {
      if (response.status === 200 && response.data.data) {
        setRoles(response.data.data as Role[]);
        setTimeout(appStore.refreshed, 1000);
      }
    }).catch(err => {
      console.log(err)
      loadAlert();
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);

  const roleList = roles?.filter(role => role.name?.includes(search))
    .map((role) => (
      <RoleItem item={role} key={role.id} refresh={refresh} />
    )) || [];

  return (
    <Flex w="100%" h="100%" flexDirection="column">
      <PageHeader title='Roles' refresh={refresh} create={onOpen} />
      <SearchInput value={search} setValue={setSearch} />
      <Flex w="100%" h="68%" direction="column" overflowX="hidden" overflowY="auto"
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
        <AnimatePresence>
          {roleList}
        </AnimatePresence>
      </Flex>
      <CreateRole isOpen={isOpen} onClose={onClose} refresh={refresh} />
    </Flex>
  );
}