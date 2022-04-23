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
import { InvitationResponse, Language, SERVERROLE } from '../client';
import { useParams } from 'react-router-dom';
import { useAlert } from '../hooks/useAlert';
import { NameField } from '../components/inputs/Name';

export const CreateLanguage: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();
  const [key, setKey] = React.useState<string>('');
  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);
  const [description, setDescription] = React.useState<string>('');
  const close = () => {
    onClose();
    setKey('');
    setDescription('');
  }
  const {languageApi} = useApi();
  const {loadAlert, success, error} = useAlert();

  const submit = () => {
    languageApi.languagesCreate({key, description, projectId}).then(response => {
      if(response.status === 201) {
        const res = response.data.data as Language;
        success('You created a language!')
        refresh();
        close();
      }
    });
  }

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
          Create a language
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <NameField ref={firstField} value={key} setValue={setKey} label="Name (key)" id="name" placeholder="en" />
              <NameField value={description} setValue={setDescription} label="Description" id="description" placeholder="English language" />
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Create language</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}