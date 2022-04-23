import * as React from "react";
import {
  Link
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, Icon, Link as ChakraLink, LinkBox, LinkOverlay, Skeleton, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { InviteProps, ItemProps, ProjectProps } from './types';
import { DeleteIcon, EmailIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { InviteRoleEnum, UserResponseRoleEnum } from '../../axiosClient';
import { Language, SERVERROLE } from '../../client';
import { useAlert } from '../../hooks/useAlert';
import { Confirm } from '../Confirm';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const LanguageItem: React.FC<ItemProps<Language>> = ({ item, refresh }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const {appStore} = useStores();
  const [dialog, setDialog] = React.useState<number>(0);

  const [loaded, setLoaded] = React.useState<boolean>(false);

  const { languageApi} = useApi();
  const {loadAlert, success, error} = useAlert();

  const remove = () => languageApi.languagesRemove(item.id).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      refresh();
      success('Language deleted');
    }
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
            p={2}
            mx={0}
            my={2}
          >
            <Text mx={3}>{item.key}</Text>
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
                zIndex={10}
                >
                <DeleteIcon />
              </MotionCircle>
            }
          </Flex>
        </MotionFlex>
      </Skeleton>
      <Confirm title='Delete language'
        description={`Are you sure you want to delete the language ${item.key}? You can't undo this action afterwards. This action will delete the translations of this language`}
        actionName='Delete'
        isOpen={dialog === 1}
        onClose={() => setDialog(0)}
        action={remove} />
    </MotionFlex>
  ));
}
