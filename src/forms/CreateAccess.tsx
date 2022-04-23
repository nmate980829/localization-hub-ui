import * as React from "react";
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Stack, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {CreateInviteProps as Props} from './types';
import { EmailField } from '../components/inputs/Email';
import { UserResponseRoleEnum, UserRoleEnum } from '../axiosClient';
import { useApi } from '../hooks/useApi';
import { useStores } from '../stores';
import { useObserver } from 'mobx-react';
import dayjs from 'dayjs';
import { InvitationResponse, Language, Role, SERVERROLE, UserResponse } from '../client';
import { useParams } from 'react-router-dom';
import { useAlert } from '../hooks/useAlert';
import { NameField } from '../components/inputs/Name';

export const CreateAccess: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();

  const [userId, setUserId] = React.useState<number>(-1);
  const [roleId, setRoleId] = React.useState<number>(-1);

  const [users, setUsers] = React.useState<UserResponse[] | undefined>(undefined);
  const [roles, setRoles] = React.useState<Role[] | undefined>(undefined);
  
  const { userApi, roleApi, accessApi } = useApi();
  const {loadAlert, success, error} = useAlert();
  
  React.useEffect(() => {
    const asyncF = async () => {
      appStore.refresh();
      try {
        const response = await userApi.usersFindAll();
        const usersR = response.data.data as UserResponse[]
        setUsers(usersR);
        setUserId(usersR[0].id)
        const roleR = (await roleApi.rolesFindAll()).data.data as Role[];
        setRoles(roleR);
        setRoleId(roleR[0].id)
        setTimeout(appStore.refreshed, 1000);
      } catch(err) {
        loadAlert();
        setTimeout(appStore.refreshed, 1000);
      }
    };
    asyncF();
  }, []);

  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);
  const close = () => {
    onClose();
    setUserId(-1);
    setRoleId(-1);
  }
  const submit = () => {
    accessApi.accessesCreate({projectId, userId, roleId}).then(response => {
      if(response.status === 201) {
        success('You granted the access!')
        refresh();
        close();
      }
    });
  }

  const userOptions = users?.map(entry => (<option value={entry.id} key={entry.id}>{entry.email}</option>));
  const roleOptions = roles?.map(entry => (<option value={entry.id} key={entry.id}>{entry.name}</option>));

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      initialFocusRef={firstField}
      onClose={close}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Grant access
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <FormLabel htmlFor="user">Select the new user you want to grant access to</FormLabel>
              <Select id="user" value={userId} onChange={(event) => setUserId(Number.parseInt(event.target.value))}>
                {userOptions}
              </Select>
            </Box>
            <Box>
              <FormLabel htmlFor="role">Select the role to be granted</FormLabel>
              <Select id="role" value={roleId} onChange={(event) => setRoleId(Number.parseInt(event.target.value))}>
                {roleOptions}
              </Select>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Grant access</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}