import * as React from "react"
import {
  Link
} from "react-router-dom";
import {CircularProgress, Flex, Heading, useColorModeValue} from '@chakra-ui/react';
import { LayoutProps } from './types';
import { StandardNav } from '../navs/StandardNav';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { DrawerNav } from '../navs/DrawerNav';
import { useApi } from '../../hooks/useApi';
import { LoaderOverlay } from '../LoaderOverlay';
import { MotionCircle } from '../Motion';
import { AnimatePresence } from 'framer-motion';

export const MainLayout: React.FC<LayoutProps> = ({children}) => {
  const headerBg = useColorModeValue('gray.400', 'gray.600');
  const {appStore} = useStores();
  const {userApi} = useApi();
  React.useEffect(() => {
    const interval = setInterval(() => {
        console.log('[sync user]', new Date());
        userApi.usersMeGet().then(response => {
          appStore.syncMe(response.data);
        });
      }, 20000);
    return () => clearInterval(interval);
  }, []);
  React.useEffect(() => console.log(appStore.user), [appStore.user]);

  return useObserver(() => (
    <Flex w="100vw" h="100vh" direction="column" overflow="hidden" >
      <Flex w="100vw" as="header" direction="row" justify="space-between" align="center" bgColor={headerBg} p={3}>
        <Link to="/">
          <Heading size="lg" pl={4}>Localization Hub</Heading>
        </Link>
        <StandardNav />
      </Flex>
      <Flex w="100%" h="100%">
        {appStore.isLoggedIn && (
          <DrawerNav />
        )}
        <Flex h="100%" maxHeight="100%" flex={1}>
          {children}
        </Flex>
      </Flex>
      {appStore.loading ? <LoaderOverlay /> : <></>}
      <AnimatePresence>
        {appStore.refreshing &&
          <MotionCircle
              bgColor="gray.100"
              position="absolute"
              top={0}
              opacity={0}
              left="50%"
              right="50%"
              zIndex={10000}
              animate={{top: '20%', opacity: 1, scale: 1}}
              exit={{top: -100, opacity: 0, scale: 0, transition: {ease: 'easeOut'}}}
              size={16}
              >
              <CircularProgress isIndeterminate color="blue.300" />
            </MotionCircle>
        }
      </AnimatePresence>
    </Flex>
  ));
}