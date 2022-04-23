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

export const CreateProject: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();
  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const close = () => {
    onClose();
    setName('');
    setDescription('');
  }
  const {projectApi} = useApi();
  const toast = useToast();
  const submit = () => {
    projectApi.projectsCreate({name, description}).then(response => {
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
      initialFocusRef={firstField}
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
            <Box>
              <NameField ref={firstField} value={name} setValue={setName} label="Name" id="id" placeholder="Project name" />
            </Box>
            <Box>
              <NameField value={description} setValue={setDescription} label="Description" id="id2" placeholder="Project Description" />
            </Box>
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