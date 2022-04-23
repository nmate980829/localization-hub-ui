import * as React from "react";
import {
  Link, useHistory, useParams
} from "react-router-dom";
import { Avatar, Badge, Box, Button, Circle, Divider, Flex, FormLabel, Heading, HStack, LinkBox, LinkOverlay, Select, Skeleton, Stack, Text, Tooltip, useColorModeValue, useDisclosure, useToast, Wrap } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProps } from './types';
import { ArrowBackIcon, DeleteIcon, EmailIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { Confirm } from '../Confirm';
import { Right, Role, SERVERROLE, UserResponse } from '../../client';
import { ChangeRole } from '../../forms/ChangeRole';
import { useAlert } from '../../hooks/useAlert';
import { NameField } from '../inputs/Name';
import { EmailField } from '../inputs/Email';
import { PasswordField } from '../inputs/Password';
import { RightItem } from '../items/Right';
import { Control } from './Identifier';
import { BackButton } from '../BackButton';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const RoleView: React.FC<UserProps> = ({ }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  let id = Number.parseInt(useParams<{id: string}>().id);
  const { appStore } = useStores();

  const [role, setRole] = React.useState<Role>();
  
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const refresh = () => setRefresh(shouldRefresh + 1);

  
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [rights, setRights] = React.useState<Right[]>([]);
  const [selectedRights, setSelectedRights] = React.useState<number[]>([]);
  const {loadAlert, success, error} = useAlert();
  const history = useHistory();
  const {roleApi, rightApi} = useApi();

  const updateRole = () => roleApi.rolesUpdate(id!!, {name, description}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated the role');
    }
  });

  const updateRights = () => roleApi.rolesUpdate(id!!, {rights: selectedRights}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated the role\'s rights');
    }
  });

  const deleteRole = () => roleApi.rolesRemove(id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0);
      history.push('/roles');
      success('You deleted the role');
    }
  });

  React.useEffect(() => {
    const apiCall = async () => {
      appStore.refresh();
      const response = await roleApi.rolesFindOne(id || -1);
      try { 
        if (response.status === 200 && response.data.data) {
          const role = response.data.data as Role
          setRole(role);
          setName(role.name);
          setDescription(role.description);
          const rightList = await rightApi.rightsFindAll();
          if (rightList.status === 200 && rightList.data.data)
            setRights(rightList.data.data as Right[]);
          const selectedList = await rightApi.rightsFindAll(role?.id);
          if (selectedList.status === 200 && selectedList.data.data)
            setSelectedRights((selectedList.data.data as Right[]).map(x => x.id));
          setTimeout(appStore.refreshed, 1000);
        } else {
          loadAlert();
          setTimeout(appStore.refreshed, 1000);  
        }
      } catch (err) {
        loadAlert();
        setTimeout(appStore.refreshed, 1000);
      };
    }
    apiCall();
  }, [shouldRefresh]);
  const switchRight = (id: number, contain: boolean) => {
    if (contain) setSelectedRights(r => r.concat([id]))
    else setSelectedRights(r => r.filter(i => i !== id))
  }
  const rightsMap = rights.map(right => <RightItem item={right} selected={selectedRights?.includes(right.id) ?? false} setSelected={(val) => switchRight(right.id, val)} />)
//circle(60px at center)
  return useObserver(() => (
    <>
      <MotionFlex
        layout
        position="relative"
        direction="row"
        align="center"
        bgColor={bg}
        w="80%"
        p={6}
        pt={12}
        mb={4}
        rounded={30}

        transition={{ duration: 0.2 }}
        exit={{ marginLeft: "-100%" }}
      >
        <MotionFlex
          direction="column"
          align="center"
          w="100%"
          bgColor={bg}
          rounded={30}
          px={3}
        >
          <HStack w="100%"> 
            <BackButton goBack={() => history.push('/roles')} />
            <Heading alignSelf="center">Role: {role?.name}</Heading>
          </HStack>
          <Stack spacing={8} my={8} w="100%">
            <Box>
              <Heading size="md">Info</Heading>
              <Divider mb={4} mt={2} />
              <NameField value={name} setValue={setName} label="Name" id="name" placeholder="Name" />
              <NameField value={description} setValue={setDescription} label="Description" id="desc" placeholder="Description" />
              <HStack>
                <Heading size="sm">Created:</Heading>
                <Text>{dayjs(role?.createdAt).format('YYYY. MM. DD. - HH:mm')}</Text>
              </HStack>
              <Button mt={2} bgColor="green.500" onClick={updateRole}>Save</Button>
            </Box>
            <Box>
              <Heading size="md">Rights</Heading>
              <Divider mb={4} mt={2} />
              <Wrap flexDirection="row">
                {rightsMap}
              </Wrap>
              <Button mt={2} bgColor="green.500" onClick={updateRights}>Save</Button>
            </Box>

            <Box>
              <Heading size="md">Delete role</Heading>
              <Divider mb={4} mt={2} />
              <Button bgColor="red.500" aria-label="Delete role" onClick={() => setDialog(1)} >Delete role</Button>
            </Box>
          </Stack>
        </MotionFlex>
      </MotionFlex>
      <Confirm title='Delete role'
        description={`Are you sure you want to delete the role named ${role?.name}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={role !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={deleteRole} />
      <Confirm title={`user`}
        description={`Are you sure you want to the user You can  him anytime later`}
        actionName={'Disable'}
        isOpen={role !== undefined && dialog === 2}
        onClose={() => setDialog(0)}
        action={() => {}} />
    </>
  ));
}
