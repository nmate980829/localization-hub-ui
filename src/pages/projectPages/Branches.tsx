import * as React from 'react';
import {
  Flex, Input, Text, useDisclosure, useToast,
} from "@chakra-ui/react";
import { PageHeader } from '../../components/PageHeader';
import { SearchInput } from '../../components/inputs/Search';
import { useApi } from '../../hooks/useApi';
import { Branch, Invite, Language, SERVERROLE as Role } from '../../client';
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

export const BranchesPage = () => {
  const [search, setSearch] = React.useState<string>('');
  const [branches, setBranches] = React.useState<Branch[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {appStore} = useStores();
  const refresh = () => setRefresh(shouldRefresh + 1);
  let id = Number.parseInt(useParams<{projectId: string}>().projectId);

  const {branchApi} = useApi();
  const {loadAlert, success, error} = useAlert();
  
  React.useEffect(() => {
    appStore.refresh();
    branchApi.branchesFindAll(id).then(response => {
      if (response.status === 200 && response.data.data) {
        setBranches(response.data.data as Branch[]);
        setTimeout(appStore.refreshed, 1000);
      }
    }).catch(err => {
      loadAlert();
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);

  const branchList = branches?.filter(branch => branch.key?.includes(search))
    .map((branch) => (
      <BranchItem item={branch} key={branch.id} refresh={refresh} />
    )) || [];

  return (
    <Flex w="100%" h="100%" flexDirection="column">
      <PageHeader title='Branches' refresh={refresh} create={onOpen} />
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
          {branchList}
        </AnimatePresence>
      </Flex>
      <CreateBranch isOpen={isOpen} onClose={onClose} refresh={refresh} />
    </Flex>
  );
}