import * as React from 'react';
import {
  Flex, Input, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/inputs/Search';
import { useApi } from '../../hooks/useApi';
import { Access, Branch, Invite, Language, SERVERROLE as Role } from '../../client';
import { InviteItem } from '../../components/items/Invite';
import { Confirm } from '../../components/Confirm';
import { AnimatePresence } from 'framer-motion';
import { CreateInvite } from '../../forms/CreateInvite';
import { useRole } from '../../hooks/useRole';
import { useStores } from '../../stores';
import { useAlert } from '../../hooks/useAlert';
import { LanguageItem } from '../../components/items/Language';
import { useParams } from 'react-router-dom';
import { CreateLanguage } from '../../forms/CreateLanguage';
import { BranchItem } from '../../components/items/Branch';
import { CreateBranch } from '../../forms/CreateBranch';
import { AccessItem } from '../../components/items/Access';
import { CreateAccess } from '../../forms/CreateAccess';

export const AccessPage = () => {
  const [search, setSearch] = React.useState<string>('');
  const [access, setAccess] = React.useState<Access[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {appStore} = useStores();
  const refresh = () => setRefresh(shouldRefresh + 1);
  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);

  const {accessApi, userApi, roleApi} = useApi();
  const {loadAlert, success, error} = useAlert();
  
  React.useEffect(() => {
    const asyncF = async () => {
      appStore.refresh();
      try {
        const response = await accessApi.accessesFindAll(projectId)
        if (response.status === 200 && response.data.data) {
          setAccess(response.data.data as Access[]);
          setTimeout(appStore.refreshed, 1000);
        }
      } catch(err) {
        loadAlert();
        setTimeout(appStore.refreshed, 1000);
      }
    };
    asyncF();
  }, [shouldRefresh]);

  const accessList = access?.map((access) => (
      <AccessItem item={access} key={access.id} refresh={refresh} />
    )) || [];

  return (
    <Flex w="100%" h="100%" flexDirection="column">
      <PageHeader title='Access' refresh={refresh} create={onOpen} />
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
          {accessList}
        </AnimatePresence>
      </Flex>
      <CreateAccess isOpen={isOpen} onClose={onClose} refresh={refresh} />
    </Flex>
  );
}