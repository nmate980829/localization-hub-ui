import * as React from "react";
import {
  Link
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, Icon, Link as ChakraLink, Skeleton, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { InviteProps, ProjectProps, TokenProps } from './types';
import { DeleteIcon, EmailIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { InviteRoleEnum, UserResponseRoleEnum } from '../../axiosClient';
import { SERVERROLE } from '../../client';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const TokenItem: React.FC<TokenProps> = ({ item, remove }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const {appStore} = useStores();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const toast = useToast();

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
            <Text mx={3}>{item.name}</Text>
            <Text mx={3}>{item.expiration}</Text>
            <Text mx={3}>{item.type}</Text>
          </Flex>
          <Flex
            direction="row"
            align="center"
            mx={0}
            my={2}
          >
            <Tooltip label={dayjs(item.createdAt).format('LLLL')} aria-label="Exact date and time">
              <Text mx={3}>
                Created: {dayjs(item.createdAt).format('YYYY. MM. DD. - HH:mm')}
              </Text>
            </Tooltip>
            {(appStore.role === SERVERROLE.Admin || appStore.role === SERVERROLE.Po) &&
              <MotionCircle
                bgColor={'red.500'}
                p={4}
                whileHover={{ scale: 1.15 }}
                onClick={remove}
                whileTap={{scale: 1.3}}
                >
                <DeleteIcon />
              </MotionCircle>
            }
          </Flex>
        </MotionFlex>
      </Skeleton>
    </MotionFlex>
  ));
}
