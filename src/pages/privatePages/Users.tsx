import * as React from 'react';
import {
  Flex, Input, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/inputs/Search';
import { useApi } from '../../hooks/useApi';
import { Invite, User, UserResponse, UserResponseRoleEnum as Role } from '../../axiosClient';
import { InviteItem } from '../../components/items/Invite';
import { Confirm } from '../../components/Confirm';
import { AnimatePresence } from 'framer-motion';
import { CreateInvite } from '../../forms/CreateInvite';
import { UserItem } from '../../components/items/User';
import { useRole } from '../../hooks/useRole';
import { useStores } from '../../stores';

export const UsersPage = () => {
  useRole(Role.Hr);
  const [search, setSearch] = React.useState<string>('');
  const [users, setUsers] = React.useState<UserResponse[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<UserResponse | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {appStore} = useStores();

  const refresh = () => setRefresh(shouldRefresh + 1);
  const remove = (user: UserResponse) => {
    setSelected(user);
    setDialog(1);
  }

  const toast = useToast();

  const {userApi} = useApi();
  const removeItem = () => userApi.usersIdDelete(selected?.id!!).then((response) => {
    if (response.status === 204) {
      setDialog(0)
      setSelected(undefined);
      refresh();
      toast({
        title: 'User deleted',
        isClosable: true,
        status: 'success',
        position: 'top',
        duration: 5000,
      });
    }
  });

  React.useEffect(() => {
    appStore.refresh();
    userApi.usersGet().then(response => {
      if (response.status === 200 && response.data.result) {
        setUsers(response.data.result);
        setTimeout(appStore.refreshed, 1000);
      }
    }).catch(err => {
      toast({
        title: 'Items cannot be loaded',
        description: 'Try to refresh',
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);

  const userList = users?.filter(user => user.email?.includes(search) || user.firstName?.includes(search) || user.lastName?.includes(search))
    .map((user) => (
      <UserItem user={user} remove={() => remove(user)} key={user.id} />
    )) || [];

  return (
    <Flex w="100%" h="100%" flexDirection="column">
      <PageHeader title='Users' refresh={refresh} />
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
          {userList}
        </AnimatePresence>
      </Flex>
      <Confirm title='Delete user'
        description={`Are you sure you want to delete the user ${selected?.lastName}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={selected !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={removeItem} />
      <Confirm title='Disable user'
        description={`Are you sure you want to disable the user ${selected?.lastName}? You can enable him anytime later`}
        actionName='Disable'
        isOpen={selected !== undefined && dialog === 2}
        onClose={() => setDialog(0)}
        action={removeItem} />
    </Flex>
  );
}