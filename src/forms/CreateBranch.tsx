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

export const CreateBranch: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();
  const [key, setKey] = React.useState<string>('');
  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);
  const close = () => {
    onClose();
    setKey('');
  }
  const {branchApi} = useApi();
  const {loadAlert, success, error} = useAlert();

  const submit = () => {
    branchApi.branchesCreate({key, projectId}).then(response => {
      if(response.status === 201) {
        success('You created a branch!')
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
          Create a branch
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <NameField ref={firstField} value={key} setValue={setKey} label="Name (key)" id="name" placeholder="main" />
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Create branch</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}