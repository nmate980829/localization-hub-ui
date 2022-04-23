import * as React from "react";
import {
  Link
} from "react-router-dom";
import { Avatar, Badge, Box, Circle, Flex, HStack, Icon, Link as ChakraLink, LinkBox, LinkOverlay, Skeleton, Text, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { AccessProps, InviteProps, ItemProps, ProjectProps, TokenProps } from './types';
import { DeleteIcon, EmailIcon, NotAllowedIcon, RepeatIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { FaRegPaperPlane } from 'react-icons/fa';
import { InviteRoleEnum, UserResponseRoleEnum } from '../../axiosClient';
import { Access, Project, Role, SERVERROLE, UserResponse } from '../../client';
import { useAlert } from '../../hooks/useAlert';
import { Confirm } from '../Confirm';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const AccessItem: React.FC<ItemProps<Access>> = ({ item, refresh }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const {appStore} = useStores();
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [user, setUser] = React.useState<UserResponse>();
  const [project, setProject] = React.useState<Project>();
  const [role, setRole] = React.useState<Role>();
  const {loadAlert} = useAlert();
  const {userApi, projectApi, accessApi, roleApi} = useApi();
  const {success} = useAlert();
  const [dialog, setDialog] = React.useState<number>(0);
  
  const removeItem = () => accessApi.accessesRemove(item.id).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      refresh();
      success('Access deleted');
    }
  });

  const revoke = () => accessApi.accessesRevoke(item.id).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      refresh();
      success('Access revoked');
    }
  });

  const regrant = () => accessApi.accessesRegrant(item.id).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      refresh();
      success('Access regranted');
    }
  });

  React.useEffect(() => {
    const asyncF = async () => {
      appStore.refresh();
      try {
        const userR = await userApi.usersFindOne(item.userId);
        setUser(userR.data.data as UserResponse);
        const projectR = await projectApi.projectsFindOne(item.projectId);
        setProject(projectR.data.data as Project);        
        const roleR = await roleApi.rolesFindOne(item.roleId);
        setRole(roleR.data.data as Role);
      } catch(err) {
        loadAlert();
      }
      setTimeout(appStore.refreshed, 1000);
      setLoaded(true);
    };
  asyncF();
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
            ml={6}
            my={2}
          >
            <Link to={`/users/${user?.id}`}>
              <HStack>
                <Text ml={5} fontWeight="bold">User: </Text>
                <Text>{user?.email}</Text>
              </HStack>
            </Link>
            <Link to={`/projects/${project?.id}`}>
              <HStack>  
                <Text ml={5} fontWeight="bold">Project: </Text>
                <Text>{project?.name}</Text>
              </HStack>
            </Link>
            <Link to={`/roles/${role?.id}`}>
              <HStack>
                <Text ml={5} fontWeight="bold">Role: </Text>
                <Text>{role?.name}</Text>
              </HStack>
            </Link>
            {project?.ownerId === user?.id &&
              <Badge variant="solid" colorScheme="orange" mx={10} fontSize="lg" rounded={10} p={1} px={6} >Owner</Badge>
            }
            {item.revoked &&
              <Badge variant="solid" colorScheme="blackAlpha" mx={10} fontSize="lg" rounded={10} p={1} px={6} >Revoked</Badge>
            }
          </Flex>
          <Flex
            direction="row"
            align="center"
            mx={0}
            my={2}
          >
            {appStore.user?.id === user?.id &&
              <Badge variant="solid" colorScheme="teal" mx={10} fontSize="lg" rounded={10} p={1} px={6} >Mine</Badge>
            }
            <Tooltip label={dayjs(item.createdAt).format('LLLL')} aria-label="Exact date and time">
              <Text mx={3}>
                Created: {dayjs(item.createdAt).format('YYYY. MM. DD.')}
              </Text>
            </Tooltip>
            <MotionCircle
              bgColor={item.revoked ? 'green.500' : 'yellow.500'}
              p={4}
              mx={2}
              whileHover={{ scale: 1.15 }}
              onClick={() => setDialog(2)}
              whileTap={{scale: 1.3}}
              >
              {item.revoked ? <RepeatIcon /> : <NotAllowedIcon />}
            </MotionCircle>
            <MotionCircle
              bgColor={'red.500'}
              p={4}
              whileHover={{ scale: 1.15 }}
              onClick={() => setDialog(1)}
              whileTap={{scale: 1.3}}
              >
              <DeleteIcon />
            </MotionCircle>
          </Flex>
        </MotionFlex>
      </Skeleton>
      <Confirm title='Delete access'
        description={`Are you sure you want to delete the access of ${user?.email} to ${project?.name} with the role of ${role?.name}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={dialog === 1}
        onClose={() => setDialog(0)}
        action={removeItem} />
      <Confirm title={`${item.revoked ? 'Regrant' : 'Revoke'} access`}
        description={`Are you sure you want to ${item.revoked ? 'Regrant' : 'Revoke'} the access of ${user?.email} to ${project?.name} with the role of ${role?.name}? You can reverse this action afterwards.`}
        actionName={item.revoked ? 'Regrant' : 'Revoke'}
        isOpen={dialog === 2}
        onClose={() => setDialog(0)}
        action={item.revoked ? regrant : revoke} />
    </MotionFlex>
  ));
}
