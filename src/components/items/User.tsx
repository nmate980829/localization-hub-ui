import * as React from "react";
import {
  Link
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, LinkBox, LinkOverlay, Skeleton, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { InviteProps, UserProps } from './types';
import { DeleteIcon, EmailIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { UserResponseRoleEnum, UserRoleEnum } from '../../axiosClient';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const UserItem: React.FC<UserProps> = ({ user, remove }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
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

  return useObserver(() => (
    <MotionFlex
      layout
      position="relative"
      direction="row"
      align="center"
      w="100%"
      px={6}
      mb={4}
      transition={{ duration: 0.2 }}
      exit={{ marginLeft: "-100%" }}
    >
      <Skeleton isLoaded={loaded} w="100%" rounded={30}>
        <LinkBox as="article">
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
              <Avatar bg="teal.600" />
              <Text mx={3}>{user.firstName} {user.lastName}</Text>
              <LinkOverlay to={`/users/${user.id}`} as={Link}>
                <Text mx={3}>{user.email}</Text>
              </LinkOverlay>
            </Flex>
            <Flex
              direction="row"
              align="center"
              mx={0}
              my={2}
            >
              <Badge variant="solid" colorScheme="teal" mx={10} fontSize="lg" rounded={10} p={1} px={6} >{user.role}</Badge>
              <Tooltip
                label={(user.id === appStore.user?.id || 
                  (user.role === UserResponseRoleEnum.Admin
                    && appStore.role !== UserResponseRoleEnum.Admin))
                    ? `You can't ${user.disabled ? 'enable' : 'disable'} ${user.id === appStore.user?.id ? 'yourself' : 'admins'}`
                    : `${user.disabled ? 'Enable' : 'Disable'} user`
                }
                aria-label={`${user.disabled ? 'Enable' : 'Disable'} User`}>
                <MotionCircle
                  bgColor={(user.id === appStore.user?.id || (user.role === UserResponseRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin)) ? 'gray.400' : 'teal.500'}
                  p={4}
                  mr={2}
                  zIndex={10}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{scale:1.3}}
                  onClick={disabledAlert}
                  >
                  {user.disabled ? <UnlockIcon /> : <LockIcon />}
                </MotionCircle>
              </Tooltip>
              
              {(user.id === appStore.user?.id || (user.role === UserResponseRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin)) ?
                <Tooltip label={`You can't delete ${ user.id === appStore.user?.id ? 'yourself' : 'admins'}`}
                  aria-label={user.id === appStore.user?.id ? 'You can\'t delete your own account':'Only admins can delete admins'}>
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
                  onClick={remove}
                  whileTap={{scale: 1.3}}>
                  <DeleteIcon />
                </MotionCircle>
              }
            </Flex>
          </MotionFlex>
        </LinkBox>
      </Skeleton>
    </MotionFlex>
  ));
}
