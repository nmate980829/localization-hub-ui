import * as React from "react";
import {
  Link, useParams
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, LinkBox, LinkOverlay, Skeleton, Text, Tooltip, useColorModeValue, useDisclosure, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProps } from './types';
import { DeleteIcon, EmailIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { UserResponse, UserResponseRoleEnum, UserRoleEnum } from '../../axiosClient';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { Confirm } from '../Confirm';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const UserView: React.FC<UserProps> = ({ }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  let {id} = useParams<{id: string}>();
  const [user, setUser] = React.useState<UserResponse | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const refresh = () => setRefresh(shouldRefresh + 1);


  const {userApi} = useApi();
  const removeItem = () => userApi.usersIdDelete(user?.id!!).then((response) => {
    if (response.status === 204) {
      setDialog(0)
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
    userApi.usersIdGet(Number.parseInt(id)).then(response => {
      if (response.status === 200 && response.data.result) {
        setUser(response.data.result);
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
  const {appStore} = useStores();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const toast = useToast();

  const disabledAlert = () => toast({
    title: 'This action cannot be performed',
    description: 'You lack the rights to do so',
    isClosable: true,
    position: 'top',
    status: 'error'
  });

  React.useEffect(() => {
    setTimeout(() => setLoaded(true), 1500);
  }, []);
//circle(60px at center)
  return useObserver(() => (
    <>
      <MotionFlex
        layout
        position="relative"
        direction="row"
        align="center"
        bgColor={bg}
        w="40%"
        p={6}
        pt={12}
        mb={4}
        rounded={30}

        transition={{ duration: 0.2 }}
        exit={{ marginLeft: "-100%" }}
      >
        <Skeleton
          isLoaded={loaded}
          pos="absolute"
          top={-14}
          width={100}
          ml="auto"
          mr="auto"
          left={0}
          right={0}
          rounded={100}>
          <Avatar
            bg="teal.600"
            size="xl"
            
            />
        </Skeleton>
        <Skeleton isLoaded={loaded} w="100%" rounded={30}>
            <MotionFlex
              direction="row"
              align="center"
              justify="space-between"
              w="100%"
              bgColor={bg}
              rounded={30}
              px={3}
              transition={{ type: 'tween' }}
              whileHover={{ x: 10}}
            >
              <Flex
                direction="row"
                align="center"
                mx={0}
                my={2}
              >
                <Text mx={3}>{user?.firstName} {user?.lastName}</Text>
                <LinkOverlay to={`/users/${user?.id}`} as={Link}>
                  <Text mx={3}>{user?.email}</Text>
                </LinkOverlay>
              </Flex>
              <Flex
                direction="row"
                align="center"
                mx={0}
                my={2}
              >
                <Badge variant="solid" colorScheme="teal" mx={10} fontSize="lg" rounded={10} p={1} px={6} >{user?.role}</Badge>
                <Tooltip
                  label={(user?.id === appStore.user?.id || 
                    (user?.role === UserResponseRoleEnum.Admin
                      && appStore.role !== UserResponseRoleEnum.Admin))
                      ? `You can't ${user?.disabled ? 'enable' : 'disable'} ${user?.id === appStore.user?.id ? 'yourself' : 'admins'}`
                      : `${user?.disabled ? 'Enable' : 'Disable'} user`
                  }
                  aria-label={`${user?.disabled ? 'Enable' : 'Disable'} User`}>
                  <MotionCircle
                    bgColor={(user?.id === appStore.user?.id || (user?.role === UserResponseRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin)) ? 'gray.400' : 'teal.500'}
                    p={4}
                    mr={2}
                    zIndex={10}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{scale:1.3}}
                    onClick={disabledAlert}
                    >
                    {user?.disabled ? <UnlockIcon /> : <LockIcon />}
                  </MotionCircle>
                </Tooltip>
                
                {(user?.id === appStore.user?.id || (user?.role === UserResponseRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin)) ?
                  <Tooltip label={`You can't delete ${ user?.id === appStore.user?.id ? 'yourself' : 'admins'}`}
                    aria-label={user?.id === appStore.user?.id ? 'You can\'t delete your own account':'Only admins can delete admins'}>
                    <MotionCircle
                      bgColor="gray.400"
                      p={4}
                      zIndex={10}
                      whileHover={{ scale: 1.15 }}
                      whileTap={{scale: 1.3}}
                      onClick={disabledAlert}>
                      <DeleteIcon />
                    </MotionCircle>
                  </Tooltip>
                  :
                  <MotionCircle
                    bgColor="red.500"
                    p={4}
                    zIndex={10}
                    whileHover={{ scale: 1.15 }}
                    onClick={undefined}
                    whileTap={{scale: 1.3}}>
                    <DeleteIcon />
                  </MotionCircle>
                }
              </Flex>
            </MotionFlex>
        </Skeleton>
      </MotionFlex>
      <Confirm title='Delete user'
        description={`Are you sure you want to delete the user ${user?.lastName}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={user !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={removeItem} />
      <Confirm title='Disable user'
        description={`Are you sure you want to disable the user ${user?.lastName}? You can enable him anytime later`}
        actionName='Disable'
        isOpen={user !== undefined && dialog === 2}
        onClose={() => setDialog(0)}
        action={removeItem} />
    </>
  ));
}
