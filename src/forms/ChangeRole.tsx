import * as React from "react";
import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, FormLabel, Input, InputGroup, InputLeftAddon, InputRightAddon, Select, Stack, Textarea, useDisclosure, useToast } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import {CreateInviteProps as Props} from './types';
import { EmailField } from '../components/inputs/Email';
import { NameField } from '../components/inputs/Name';
import { UserResponseRoleEnum, UserRoleEnum } from '../axiosClient';
import { useApi } from '../hooks/useApi';
import { useStores } from '../stores';
import { useObserver } from 'mobx-react';
import dayjs from 'dayjs';
import { InvitationResponse, Project, SERVERROLE } from '../client';

export const ChangeRole: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const {appStore} = useStores();
  const [role, setRole] = React.useState<SERVERROLE | undefined>(undefined);
  const close = () => {
    onClose();
    setRole(undefined);
  }
  const {userApi} = useApi();
  const toast = useToast();
  const submit = () => {
    userApi.usersUpdateMe({}).then(response => {
      if(response.status === 201) {
        const res = response.data.data as Project;
        toast({
          title: 'Success',
          description: `You successfully created a project named ${
            res.name
          }`,
          isClosable: true,
          status: 'success',
          position: 'top',
          duration: 10000,
        });
        refresh();
        close();
      }
    });
  }
  const options = useObserver(() =>
    Object.entries(UserRoleEnum)
      .filter(entry => appStore.role === SERVERROLE.Admin || entry[1] !== UserRoleEnum.Admin)
      .map(entry => (<option value={entry[1]} key={entry[1]}>{entry[0]}</option>))
    );

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      onClose={close}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          Create a new project
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Create project</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}