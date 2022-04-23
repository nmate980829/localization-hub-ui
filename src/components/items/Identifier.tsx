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
import { Access, Branch, Identifier, Project, Role, SERVERROLE, Translation, UserResponse } from '../../client';
import { useAlert } from '../../hooks/useAlert';
import { Confirm } from '../Confirm';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const IdentifierItem: React.FC<ItemProps<Identifier>> = ({ item, refresh }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const {appStore} = useStores();
  const [branch, setBranch] = React.useState<Branch>();
  const [children, setChildren] = React.useState<Identifier[]>();
  const [translations, setTranslations] = React.useState<Translation[]>();
  const {loadAlert} = useAlert();
  const {identifierApi, branchApi, translationApi} = useApi();
  const {success} = useAlert();
  const [dialog, setDialog] = React.useState<number>(0);

  React.useEffect(() => {
    const asyncF = async () => {
      try {
        const branchR = await branchApi.branchesFindOne(item.branchId);
        setBranch(branchR.data.data as Branch);
        const childrenR = await identifierApi.identifiersFindAll(item.projectId, item.id);
        setChildren(childrenR.data.data as Identifier[]);        
        const translationR = await translationApi.translationsFindAll(undefined, item.id);
        setTranslations(translationR.data.data as Translation[]);
      } catch(err) {
        loadAlert();
      }
    };
  asyncF();
  }, []);
  return useObserver(() => (
    <Flex
      layout
      position="relative"
      direction="row"
      align="center"
      w="100%"
      px={6}
      mb={4}
      >
      <LinkBox as="article" w="100%">
        <LinkOverlay to={`/projects/${item.projectId}/identifiers/${item.id}`} as={Link}/>
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
            <Text mx={3} fontWeight="bold">{item.key}</Text>
            <Badge variant="solid" colorScheme="orange" mx={10} fontSize="lg" rounded={10} p={1} px={6} >{branch?.key}</Badge>
          </Flex>
          <Flex
            direction="row"
            align="center"
            mx={0}
            my={2}
          >
            {children?.length!! <= 0 && <Icon as={FaLeaf}/>}
            {appStore.user?.id === item.userId &&
              <Badge variant="solid" colorScheme="teal" mx={10} fontSize="lg" rounded={10} p={1} px={6} >Mine</Badge>
            }
            <Tooltip label={dayjs(item.createdAt).format('LLLL')} aria-label="Exact date and time">
              <Text mx={3}>
                Created: {dayjs(item.createdAt).format('YYYY. MM. DD.')}
              </Text>
            </Tooltip>
          </Flex>
        </Flex>
      </LinkBox>
    </Flex>
  ));
}
