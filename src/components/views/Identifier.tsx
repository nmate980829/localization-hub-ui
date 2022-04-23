import * as React from "react";
import {
  Link, useHistory, useParams
} from "react-router-dom";
import { Avatar, Badge, Box, Button, Circle, Divider, Flex, FormLabel, Heading, HStack, LinkBox, LinkOverlay, Select, Skeleton, Square, Stack, Text, Tooltip, useColorModeValue, useDisclosure, useToast, Wrap } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProps } from './types';
import { ArrowBackIcon, DeleteIcon, EmailIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { Confirm } from '../Confirm';
import { Branch, Identifier, Project, SERVERROLE, Translation, UserResponse } from '../../client';
import { ChangeRole } from '../../forms/ChangeRole';
import { useAlert } from '../../hooks/useAlert';
import { NameField } from '../inputs/Name';
import { EmailField } from '../inputs/Email';
import { PasswordField } from '../inputs/Password';
import { CreateIdentifier } from '../../forms/CreateIdentifier';
import { IdentifierItem } from '../items/Identifier';
import { CreateTranslation } from '../../forms/CreateTranslation';
import { TranslationItem } from '../items/Translation';

export const Control = motion(Square);
dayjs.extend(LocalizedFormat);

export const IdentifierView: React.FC<UserProps> = ({ }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const backBg = useColorModeValue('gray.200', 'gray.400');
  const projectId = Number.parseInt(useParams<{projectId: string}>().projectId);
  const identifierParam = useParams<{iid: string}>().iid;
  const identifierId = identifierParam && Number.parseInt(identifierParam);

  const { appStore } = useStores();
  const userId = useObserver(() => appStore.user?.id );
  const [identifier, setIdentifier] = React.useState<Identifier | undefined>(undefined);
  const [branch, setBranch] = React.useState<Branch | undefined>(undefined);
  const [children, setChildren] = React.useState<Identifier[] | undefined>(undefined);
  const [translations, setTranslations] = React.useState<Translation[] | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const refresh = () => setRefresh(shouldRefresh + 1);

  const {identifierApi, translationApi, branchApi} = useApi();

  const [key, setKey] = React.useState<string>('');
  const [branchId, setDescription] = React.useState<string>('');
// TODO: resetPAssword
  const {loadAlert, success, error} = useAlert();
  const history = useHistory();

  const update = () => identifierApi.identifiersUpdate(identifierId || -1, {key}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated the project');
    }
  });

  const remove = () => identifierApi.identifiersRemove(identifierId || -1).then((response) => {
    if (response.status === 200) {
      setDialog(0);
      history.push(`/projects/${projectId}/identifiers/${identifier?.parentId || ''}`);
      success('You deleted the identifier');
    }
  });
  const goBack = () => history.push(`/projects/${projectId}/identifiers/${identifier?.parentId || ''}`);
  // TODO: key update, branch update
  // TODO: Add children
  // TODO: Add translation diff view
  // TODO: Delete
  React.useEffect(() => {
    const asyncF = async () => {
      try {
        if (identifierId) {
          const idR = await identifierApi.identifiersFindOne(identifierId);
          const idC = idR.data.data as Identifier;
          setIdentifier(idC);
          setKey(idC.key)
          const branchR = await branchApi.branchesFindOne(idC.branchId);
          setBranch(branchR.data.data as Branch);
          const childrenR = await identifierApi.identifiersFindAll(projectId, identifierId);
          setChildren(childrenR.data.data as Identifier[]);        
          const translationR = await translationApi.translationsFindAll(undefined, identifierId);
          setTranslations(translationR.data.data as Translation[]);
        } else {
          const childrenR = await identifierApi.identifiersFindAll(projectId, -1);
          setChildren(childrenR.data.data as Identifier[]);     
        }
      } catch(err) {
        loadAlert();
      }
    };
  asyncF();
  }, [shouldRefresh, identifierId]);
  const childrenMap = children?.map(child => <IdentifierItem key={child.id} item={child} refresh={refresh} />)
  const translationMap = translations?.map(child => <TranslationItem key={child.id} item={child} refresh={refresh} />)
//circle(60px at center)
  return useObserver(() => (
    <>
      <MotionFlex
        layout
        position="relative"
        direction="row"
        align="center"
        bgColor={bg}
        w="80%"
        p={6}
        pt={12}
        mb={4}
        rounded={30}
        transition={{ duration: 0.2 }}
        exit={{ marginLeft: "-100%" }}
      >
        <MotionFlex
          direction="column"
          align="center"
          w="100%"
          bgColor={bg}
          rounded={30}
          px={3}
        >
          <HStack w="100%">
            {identifierId && 
              <Control
                onClick={goBack}
                bgColor={backBg}
                p={3}
                px={4}
                as="button"
                borderRadius="xl"
                layout
                whileHover={{scale: 1.1}}
                alignSelf="start"
                mr={4}
                >
                  <ArrowBackIcon />
              </Control>
            }
            <Heading alignSelf="center">Identifier: {identifier?.key}</Heading>
          </HStack>
          {identifierId !== undefined &&
            <Stack spacing={8} my={8}>
              <Stack>
                <HStack>
                  <Heading size="md">Identifier</Heading>
                  <Link to={`/projects/${projectId}/branches/${branch?.id}`}>
                    <Badge variant="solid" colorScheme="orange" mx={10} fontSize="lg" rounded={10} p={1} px={6} >{branch?.key}</Badge>
                  </Link>
                </HStack>
                <Divider mb={4} mt={2} />
                <Box>
                  <NameField value={key} setValue={setKey} label="Key" id="key" placeholder="generatedIdentifier" />
                  <Button mt={2} bgColor="green.500" onClick={update}>Save</Button>
                </Box>
              </Stack>
              <Box>
                <Heading size="md">Delete the Identifier</Heading>
                <Divider mb={4} mt={2} />
                <Text mb={4}>Are you sure you want to delete the identifier named {identifier?.key}? This action deletes everything related to this identifier. Please do not delete it if you are not sure you are supposed to!</Text>
                <Button bgColor="red.500" aria-label="Delete the identifier" onClick={() => setDialog(1)} >Delete Identifier</Button>
              </Box>
            </Stack>
          }
          <HStack>
            {(translations == undefined  || translations?.length!! <= 0) && <Button mx={2} bgColor="green.500" onClick={() => setDialog(2)}>Add identifier</Button>}
            {children?.length!! <= 0 && <Button mt={2} mx={2} bgColor="blue.500" onClick={() => setDialog(3)}>Add translation</Button>}
          </HStack>
          {childrenMap}
          {translationMap}
        </MotionFlex>
      </MotionFlex>
      <CreateIdentifier isOpen={dialog === 2} onClose={() => setDialog(0)} refresh={refresh} parentId={identifierId || -1} />
      <CreateTranslation isOpen={dialog === 3} onClose={() => setDialog(0)} refresh={refresh} identifierId={identifierId || -1} />
      <Confirm title='Delete identifier'
        description={`Are you sure you want to delete the identifier named ${identifier?.key}? This action deletes everything related to this identifier. Please do not delete it if you are not sure you are supposed to!`}
        actionName='Delete'
        isOpen={identifier !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={remove} />
    </>
  ));
}
