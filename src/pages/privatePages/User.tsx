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

export const UserPage = () => {
  const { accessApi } = useApi();
  const { appStore } = useStores();
  const [accesses, setAccesses] = React.useState<Access[]>(); 
  const [shouldRefresh, setShouldRefresh] = React.useState<number>(0);
  const refresh = () => setShouldRefresh(value => value + 1);
  const {loadAlert} = useAlert();
  let id = Number.parseInt(useParams<{id: string}>().id);

  React.useEffect(() => {
    appStore.refresh();
    accessApi.accessesFindAll(undefined, id).then(response => {
      if (response.status === 200 && response.data.data) {
        setAccesses(response.data.data as Access[]);
        setTimeout(appStore.refreshed, 1000);
      } else {
        loadAlert();
        setTimeout(appStore.refreshed, 1000);  
      }
    }).catch(err => {
      loadAlert();
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);

  const accessMap = accesses?.map(element => <AccessItem item={element} refresh={refresh} />)
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
      <UserView />
      <Heading pb={4}>Accesses</Heading>
      {accessMap}
    </Flex>
  );
}