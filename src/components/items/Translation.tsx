import * as React from "react";
import {
  Link, useParams
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, Icon, Link as ChakraLink, LinkBox, LinkOverlay, Skeleton, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { AccessProps, InviteProps, ItemProps, ProjectProps, TokenProps } from './types';
import { DeleteIcon, EmailIcon, NotAllowedIcon, RepeatIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { FaLeaf, FaRegPaperPlane } from 'react-icons/fa';
import { InviteRoleEnum, UserResponseRoleEnum } from '../../axiosClient';
import { Access, Branch, Identifier, Language, Project, Role, SERVERROLE, Translation, UserResponse } from '../../client';
import { useAlert } from '../../hooks/useAlert';
import { Confirm } from '../Confirm';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const TranslationItem: React.FC<ItemProps<Translation>> = ({ item, refresh }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const {appStore} = useStores();
  const [language, setLanguage] = React.useState<Language>();

  const {loadAlert} = useAlert();
  const {languageApi, translationApi} = useApi();
  const {success} = useAlert();
  const [dialog, setDialog] = React.useState<number>(0);

  const remove = () => translationApi.translationsRemove(item.id).then(response => {
    if (response.status === 200) {
      setDialog(0)
      refresh();
      success('Translation deleted');
    }
  });

  React.useEffect(() => {
    const asyncF = async () => {
      try {
        const languageR = await languageApi.languagesFindOne(item.languageId);
        setLanguage(languageR.data.data as Language);
      } catch(err) {
        loadAlert();
      }
    };
  asyncF();
  }, []);
  return useObserver(() => (
    <Flex
      position="relative"
      direction="row"
      align="center"
      w="100%"
      px={6}
      mb={4}
     >
      <Flex
        direction="row"
        align="center"
        justify="space-between"
        w="100%"
        bgColor={bg}
        rounded={30}
        px={3}
       >
        <Flex
          direction="row"
          align="center"
          mx={0}
          my={2}
        >  
          <Badge variant="solid" colorScheme="orange" mr={5} fontSize="lg" rounded={10} p={1} px={6} >{language?.key}</Badge>
          <Text mx={3} fontWeight="bold">{item.value}</Text>
        </Flex>
        <Flex
          direction="row"
          align="center"
          mx={0}
          my={2}
        >
          <Tooltip label={dayjs(item.createdAt).format('LLLL')} aria-label="Exact date and time">
            <Text mx={3}>
              Created: {dayjs(item.createdAt).format('YYYY. MM. DD.')}
            </Text>
          </Tooltip>
          <MotionCircle
            bgColor={'red.500'}
            p={4}
            whileHover={{ scale: 1.15 }}
            onClick={() => setDialog(1)}
            whileTap={{scale: 1.3}}
            zIndex={10}
            >
            <DeleteIcon />
          </MotionCircle>
        </Flex>
      </Flex>
      <Confirm title='Delete translation'
        description={`Are you sure you want to delete the translation?`}
        actionName='Delete'
        isOpen={dialog === 1}
        onClose={() => setDialog(0)}
        action={remove} />
    </Flex>
  ));
}
