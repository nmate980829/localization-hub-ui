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

export const CreateTranslation: React.FC<Props & {identifierId: number}> = ({isOpen, onClose, refresh, identifierId}) => {
  const firstField = React.useRef(null);
  const {appStore} = useStores();

  const [value, setValue] = React.useState<string>('');
  const [languageId, setLanguageId] = React.useState<number>(-1);
  const [languages, setLanguages] = React.useState<Language[] | undefined>(undefined);
  
  const { translationApi, identifierApi, languageApi } = useApi();
  const {loadAlert, success, error} = useAlert();
  let projectId = Number.parseInt(useParams<{projectId: string}>().projectId);

  React.useEffect(() => {
    const asyncF = async () => {
      try {
        const response = await languageApi.languagesFindAll(projectId);
        const languageR = response.data.data as Language[];
        setLanguages(languageR);
        setLanguageId(languageR[0].id)
      } catch(err) {
        loadAlert();
      }
    };
    asyncF();
  }, [identifierId]);

  const close = () => {
    onClose();
    setLanguageId(languages === undefined ? -1 : languages[0].id);
    setValue('');
  }
  const submit = () => {
    translationApi.translationsCreate({value, identifierId, languageId }).then(response => {
      if(response.status === 201) {
        success('You created a translation!')
        refresh();
        close();
      }
    });
  }

  const languageOptions = languages?.map(entry => (<option value={entry.id} key={entry.id}>{entry.key}</option>));

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
          Create a translation
        </DrawerHeader>

        <DrawerBody>
          <Stack spacing="24px" mt={8}>
            <Box>
              <NameField ref={firstField} value={value} setValue={setValue} label="Value" id="Value" placeholder="Localized text" />
              <FormLabel htmlFor="language">Select the language to add the translation in</FormLabel>
              <Select id="language" value={languageId} onChange={(event) => setLanguageId(Number.parseInt(event.target.value))}>
                {languageOptions}
              </Select>
            </Box>
          </Stack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={close}>
            Cancel
          </Button>
          <Button colorScheme="blue" onClick={submit}>Create translation</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}