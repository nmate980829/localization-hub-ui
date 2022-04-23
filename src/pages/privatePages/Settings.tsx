import * as React from 'react';
import {
  Flex, Heading, useToast,
} from "@chakra-ui/react";
import { SERVERROLE as Role, TokenResponse } from '../../client';
import { useRole } from '../../hooks/useRole';
import { Confirm } from '../../components/Confirm';
import { UserView } from '../../components/views/User';
import { useApi } from '../../hooks/useApi';
import { useStores } from '../../stores';
import { TokenItem } from '../../components/items/Token';
import { SettingsView } from '../../components/views/Settings';

export const SettingsPage = () => {
  const { tokenApi } = useApi();
  const { appStore } = useStores();
  const [tokens, setTokens] = React.useState<TokenResponse[]>(); 
  const [shouldRefresh, setShouldRefresh] = React.useState<number>(0);
  const refresh = () => setShouldRefresh(value => value + 1);
  const [dialog, setDialog] = React.useState<number>(0);
  const [selected, setSelected] = React.useState<TokenResponse | undefined>(undefined);
  const toast = useToast();
  const removeItem = () => tokenApi.tokensRemove(selected?.id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      setSelected(undefined);
      refresh();
      toast({
        title: 'Token deleted',
        isClosable: true,
        status: 'success',
        position: 'top',
        duration: 5000,
      });
    }
  });
  React.useEffect(() => {
    appStore.refresh();
    tokenApi.tokensFindAll().then(response => {
      if (response.status === 200 && response.data.data) {
        setTokens(response.data.data as TokenResponse[]);
        setTimeout(appStore.refreshed, 1000);
      } else {
        toast({
          title: 'Item cannot be loaded',
          description: 'Try to refresh',
          isClosable: true,
          position: 'top',
          status: 'error'
        });
        setTimeout(appStore.refreshed, 1000);  
      }
    }).catch(err => {
      toast({
        title: 'Item cannot be loaded',
        description: 'Try to refresh',
        isClosable: true,
        position: 'top',
        status: 'error'
      });
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);

  const remove = (element: TokenResponse) => {
    setSelected(element);
    setDialog(1);
  };

  const tokenMap = tokens?.map(element => <TokenItem item={element} remove={() => remove(element)} />)
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
        <SettingsView />
        <Heading pb={4}>Logins</Heading>
        {tokenMap}
      <Confirm title='Delete token'
        description={`Are you sure you want to delete the token ${selected?.name}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={selected !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={removeItem} />
    </Flex>
  );
}