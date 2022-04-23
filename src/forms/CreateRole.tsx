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
import { InvitationResponse, Role, SERVERROLE } from '../client';
import { useAlert } from '../hooks/useAlert';
import { NameField } from '../components/inputs/Name';

export const CreateRole: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const close = () => {
    onClose();
    setName('');
    setDescription('');
  }
  const {roleApi} = useApi();
  const {success} = useAlert();
  const submit = () => roleApi.rolesCreate({name, description, rights: []}).then(response => {
      if(response.status === 201) {
        const res = response.data.data as Role;
        success('You created a role named: ' + res.name);
        refresh();
        close();
      }
  });
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
          Create a new role
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <NameField ref={firstField} value={name} setValue={setName} label="Name" id="Name" placeholder="Name of the Role" />
            </Box>
            <Box>
              <NameField value={description} setValue={setDescription} label="Description" id="Description" placeholder="Description of the Role" />
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Create role</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}