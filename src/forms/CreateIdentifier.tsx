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
import { Branch, InvitationResponse, Language, Role, SERVERROLE, UserResponse } from '../client';
import { useParams } from 'react-router-dom';
import { useAlert } from '../hooks/useAlert';
import { NameField } from '../components/inputs/Name';

export const CreateIdentifier: React.FC<Props & {parentId: number}> = ({isOpen, onClose, refresh, parentId}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();

  const [key, setKey] = React.useState<string>('');
  const [branchId, setBranchId] = React.useState<number>(-1);
  const [branches, setBranches] = React.useState<Branch[] | undefined>(undefined);
  
  const { branchApi, identifierApi } = useApi();
  const {loadAlert, success, error} = useAlert();
  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);
  const identifierParam = useParams<{iid: string}>().iid;
  const identifierId = identifierParam && Number.parseInt(identifierParam);

  React.useEffect(() => {
    const asyncF = async () => {
      try {
        const response = await branchApi.branchesFindAll(projectId);
        const branchR = response.data.data as Branch[]
        setBranches(branchR);
        setBranchId(branchR[0].id)
      } catch(err) {
        loadAlert();
      }
    };
    asyncF();
  }, [identifierId]);

  const close = () => {
    onClose();
    setBranchId(branches === undefined ? -1 : branches[0].id);
  }
  const submit = () => {
    identifierApi.identifiersCreate({key, projectId, parentId: parentId <= 0 ? undefined : parentId, branchId }).then(response => {
      if(response.status === 201) {
        success('You created an identifier!')
        refresh();
        close();
      }
    });
  }

  const branchOptions = branches?.map(entry => (<option value={entry.id} key={entry.id}>{entry.key}</option>));

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
          Create an identifier
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <NameField ref={firstField} value={key} setValue={setKey} label="Key" id="key" placeholder="okButtonText" />
              <FormLabel htmlFor="branch">Select the branch to create the identifier on</FormLabel>
              <Select id="branch" value={branchId} onChange={(event) => setBranchId(Number.parseInt(event.target.value))}>
                {branchOptions}
              </Select>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Create identifier</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}