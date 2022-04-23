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

export const MergeBranch: React.FC<Props & {sourceId: number}> = ({isOpen, onClose, refresh, sourceId}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();

  const [branchId, setBranchId] = React.useState<number>(-1);

  const [branches, setBranches] = React.useState<Branch[] | undefined>(undefined);
  
  const { branchApi } = useApi();
  const {loadAlert, success, error} = useAlert();
  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);

  React.useEffect(() => {
    const asyncF = async () => {
      appStore.refresh();
      try {
        const response = await branchApi.branchesFindAll(projectId);
        const branchR = response.data.data as Branch[]
        setBranches(branchR);
        setBranchId(branchR[0].id)
        setTimeout(appStore.refreshed, 1000);
      } catch(err) {
        loadAlert();
        setTimeout(appStore.refreshed, 1000);
      }
    };
    asyncF();
  }, []);

  const close = () => {
    onClose();
    setBranchId(branches === undefined ? -1 : branches[0].id);
  }
  const submit = () => {
    branchApi.branchesMerge(sourceId, {branchId}).then(response => {
      if(response.status === 200) {
        success('You merged the branch!')
        refresh();
        close();
      }
    });
  }

  const branchOptions = branches?.filter(x => x.id !== sourceId).map(entry => (<option value={entry.id} key={entry.id}>{entry.key}</option>));

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
          Merge branch
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <FormLabel htmlFor="user">Select the the target branch to merge into</FormLabel>
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
          <Button colorScheme="blue" onClick={submit}>Merge</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}