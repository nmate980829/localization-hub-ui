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
import { InvitationResponse, SERVERROLE } from '../client';

export const CreateInvite: React.FC<Props> = ({isOpen, onClose, refresh}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();
  const [email, setEmail] = React.useState<string>('');
  const [role, setRole] = React.useState<SERVERROLE>(SERVERROLE.User);
  const close = () => {
    onClose();
    setEmail('');
    setRole(SERVERROLE.User);
  }
  const {inviteApi} = useApi();
  const toast = useToast();
  const submit = () => {
    inviteApi.invitationsCreate({email, role}).then(response => {
      if(response.status === 201) {
        const res = response.data.data as InvitationResponse;
        toast({
          title: 'Success',
          description: `You successfully invited ${
            res.email
          } to work with you as a ${
            res.role
          }. They have to accept the invitation before ${
            dayjs(res.expiration).format('YYYY. MM. DD')
          }. After that you have to create a new invitation`,
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
          Invite a new user
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <EmailField ref={firstField} value={email} setValue={setEmail} />
            </Box>
            <Box>
              <FormLabel htmlFor="role">Select the Role of the new user</FormLabel>
              <Select id="role" defaultValue={UserRoleEnum.User} value={role} onChange={(event) => setRole(event.target.value as SERVERROLE)}>
                {options}
              </Select>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Invite</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}