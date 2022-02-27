import * as React from "react";
import {
  Link
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, Icon, Link as ChakraLink, Skeleton, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { InviteProps } from './types';
import { DeleteIcon, EmailIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { InviteRoleEnum, UserResponseRoleEnum } from '../../axiosClient';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const InviteItem: React.FC<InviteProps> = ({ invite, remove, resend }) => {
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
            {appStore.user?.id === invite.initiatorId &&
              <Badge variant="solid" colorScheme="teal" mx={2} fontSize="lg" rounded={10} p={1} px={6} >MINE</Badge>
            }
            {dayjs().isAfter(invite.expiration) &&
              <Badge variant="solid" colorScheme="red" mx={2} fontSize="lg" rounded={10} p={1} px={6} >EXPIRED</Badge>
            }
            <Text mx={3}>{invite.email}</Text>
            <Text mx={3}>{invite.initiator?.firstName}</Text>
          </Flex>
          <Flex
            direction="row"
            align="center"
            mx={0}
            my={2}
          >
            <Tooltip label={dayjs(invite.expiration).format('LLLL')} aria-label="Exact date and time">
              <Text mx={3}>
                Expires: {dayjs(invite.expiration).format('YYYY. MM. DD. - HH:mm')}
              </Text>
            </Tooltip>
            <Tooltip label={dayjs(invite.createdAt).format('LLLL')} aria-label="Exact date and time">
              <Text mx={3}>
                Created: {dayjs(invite.createdAt).format('YYYY. MM. DD. - HH:mm')}
              </Text>
            </Tooltip>
            <Badge variant="solid" colorScheme="teal" mx={10} fontSize="lg" rounded={10} p={1} px={6} >{invite.role}</Badge>
            <Tooltip label="Resend invitation" aria-label="Resend invitation">
              <MotionCircle bgColor="teal.500" p={4} mr={2} whileHover={{ scale: 1.15 }} onClick={resend} whileTap={{scale: 1.3}}>
                <Icon as={FaRegPaperPlane} />
                {//<EmailIcon />
                }
              </MotionCircle>
            </Tooltip>
            <Tooltip label={(invite.role === InviteRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin) ? 'You cannot delete an admin invite': ''} >
              <MotionCircle
                bgColor={(invite.role === InviteRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin) ? 'gray.400' : 'red.500'}
                p={4}
                whileHover={{ scale: 1.15 }}
                onClick={(invite.role === InviteRoleEnum.Admin && appStore.role !== UserResponseRoleEnum.Admin) ? disabledAlert : remove}
                whileTap={{scale: 1.3}}
                >
                <DeleteIcon />
              </MotionCircle>
            </Tooltip>
          </Flex>
        </MotionFlex>
      </Skeleton>
    </MotionFlex>
  ));
}
