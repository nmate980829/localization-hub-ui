import * as React from 'react';
import {
  Flex, Input, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/inputs/Search';
import { useApi } from '../../hooks/useApi';
import { Invite, SERVERROLE as Role } from '../../client';
import { InviteItem } from '../../components/items/Invite';
import { Confirm } from '../../components/Confirm';
import { AnimatePresence } from 'framer-motion';
import { CreateInvite } from '../../forms/CreateInvite';
import { useRole } from '../../hooks/useRole';
import { useStores } from '../../stores';

export const InvitesPage = () => {
  useRole(Role.Hr);
  const [search, setSearch] = React.useState<string>('');
  const [invites, setInvites] = React.useState<Invite[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<Invite | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {appStore} = useStores();
  const refresh = () => setRefresh(shouldRefresh + 1);
  const remove = (invite: Invite) => {
    setSelected(invite);
    setDialog(1);
  }
  const resend = (invite: Invite) => {
    setSelected(invite);
    setDialog(2);
  }

  const toast = useToast();

  const {inviteApi} = useApi();
  const removeItem = () => inviteApi.invitationsRemove(selected?.id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      setSelected(undefined);
      refresh();
      toast({
        title: 'Invite deleted',
        isClosable: true,
        status: 'success',
        position: 'top',
        duration: 5000,
      });
    }
  });
  const resendItem = () => inviteApi.invitationsResend(selected?.id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      setSelected(undefined);
      refresh();
      toast({
        title: 'Invite resent',
        isClosable: true,
        status: 'success',
        position: 'top',
        duration: 5000,
      });
    }
  });

  React.useEffect(() => {
    appStore.refresh();
    inviteApi.invitationsFindAll().then(response => {
      console.log(response)
      if (response.status === 200 && response.data.data) {
        setInvites(response.data.data as Invite[]);
        setTimeout(appStore.refreshed, 1000);
      }
    }).catch(err => {
      console.log(err)
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

  const inviteList = invites?.filter(invite => invite.email?.includes(search))
    .map((invite) => (
      <InviteItem item={invite} remove={() => remove(invite)} key={invite.id} resend={() => resend(invite)} />
    )) || [];

  return (
    <Flex w="100%" h="100%" flexDirection="column">
      <PageHeader title='Invitations' refresh={refresh} create={onOpen} />
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
          {inviteList}
        </AnimatePresence>
      </Flex>
      <Confirm title='Delete invitation'
        description={`Are you sure you want to delete the invite to ${selected?.email}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={selected !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={removeItem} />
      <Confirm title='Resend invitation'
        description={`Are you sure you want to resend the invite to ${selected?.email}? This action invalidates the previous invite, and the recipient will recieve a new email with the new invite.`}
        actionName='Resend'
        isOpen={selected !== undefined && dialog === 2}
        onClose={() => setDialog(0)}
        action={resendItem} />
      <CreateInvite isOpen={isOpen} onClose={onClose} refresh={refresh} />
    </Flex>
  );
}