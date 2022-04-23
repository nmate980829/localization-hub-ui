import * as React from "react";
import {
  Link, useHistory, useParams
} from "react-router-dom";
import { Avatar, Badge, Box, Button, Circle, Divider, Flex, FormLabel, Heading, HStack, LinkBox, LinkOverlay, Select, Skeleton, Stack, Text, Tooltip, useColorModeValue, useDisclosure, useToast, Wrap } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { AnimatePresence, motion } from 'framer-motion';
import { UserProps } from './types';
import { DeleteIcon, EmailIcon, LockIcon, UnlockIcon } from '@chakra-ui/icons';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { Confirm } from '../Confirm';
import { Project, SERVERROLE, UserResponse } from '../../client';
import { ChangeRole } from '../../forms/ChangeRole';
import { useAlert } from '../../hooks/useAlert';
import { NameField } from '../inputs/Name';
import { EmailField } from '../inputs/Email';
import { PasswordField } from '../inputs/Password';

dayjs.extend(LocalizedFormat);

export const ProjectView: React.FC<UserProps> = ({ }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  let id = Number.parseInt(useParams<{projectId: string}>().projectId);
  const { appStore } = useStores();
  const userId = useObserver(() => appStore.user?.id );
  const [project, setProject] = React.useState<Project | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const refresh = () => setRefresh(shouldRefresh + 1);

  const {projectApi} = useApi();

  const [name, setName] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
// TODO: resetPAssword
  const {loadAlert, success, error} = useAlert();
  const history = useHistory();

  const update = () => projectApi.projectsUpdate(id!!, {name, description}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated the project');
    }
  });

  const remove = () => projectApi.projectsRemove(id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0);
      history.push('/projects');
      success('You deleted the project');
    }
  });

  React.useEffect(() => {
    appStore.refresh();
    projectApi.projectsFindOne(id || -1).then(response => {
      if (response.status === 200 && response.data.data) {
        const project = response.data.data as Project;
        setProject(project);
        setName(project.name);
        setDescription(project.description);
        setTimeout(appStore.refreshed, 1000);
      } else {
        loadAlert();
        setTimeout(appStore.refreshed, 1000);  
      }
    }).catch(err => {
      loadAlert();
      setTimeout(appStore.refreshed, 1000);
    });
  }, [shouldRefresh]);
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
          <Heading>Project</Heading>
          <Stack spacing={8} my={8}>
            <Stack>
              <HStack>
                <Heading size="md">General info</Heading>
                {project?.ownerId === userId &&
                  <Badge variant="solid" colorScheme="orange" mx={10} fontSize="lg" rounded={10} p={1} px={6} >Owner</Badge>
                }
              </HStack>
              <Divider mb={4} mt={2} />
              {(appStore.user?.role === SERVERROLE.Admin || appStore.user?.role === SERVERROLE.Po) ?
                <>
                  <NameField value={name} setValue={setName} label="Name" id="name" placeholder="Name" />
                  <NameField value={description} setValue={setDescription} label="Description" id="desc" placeholder="Description" />
                  <HStack>
                    <Heading size="sm">Created:</Heading>
                    <Text>{dayjs(project?.createdAt).format('YYYY. MM. DD. - HH:mm')}</Text>
                  </HStack>
                  <Box>
                    <Button mt={2} bgColor="green.500" onClick={update}>Save</Button>
                  </Box>
                </>
              :
                <>
                  <HStack>
                    <Heading size="sm">Name: </Heading>
                    <Text >{project?.name}</Text>  
                  </HStack>
                  <HStack>
                    <Heading size="sm">Description: </Heading>
                    <Text >{project?.description}</Text>  
                  </HStack>
                  <HStack>
                    <Heading size="sm">Created:</Heading>
                    <Text>{dayjs(project?.createdAt).format('YYYY. MM. DD. - HH:mm')}</Text>
                  </HStack>
                </>
              }
            </Stack>
            {(appStore.user?.role === SERVERROLE.Admin || appStore.user?.role === SERVERROLE.Po) &&
              <>
                <Box>
                  <Heading size="md">Delete the project</Heading>
                  <Divider mb={4} mt={2} />
                  <Text mb={4}>Are you sure you want to delete the project named {project?.name}? You can't undo this action afterwards. This action deletes everything related to this project. Please do not delete it if you are not sure you are supposed to!</Text>
                  <Button bgColor="red.500" aria-label="Delete the project" onClick={() => setDialog(1)} >Delete project</Button>
                </Box>
              </>
            }
          </Stack>
        </MotionFlex>
      </MotionFlex>
      <Confirm title='Delete project'
        description={`Are you sure you want to delete the project named ${project?.name}? You can't undo this action afterwards. This action deletes everything related to this project. Please do not delete it if you are not sure you are supposed to!`}
        actionName='Delete'
        isOpen={project !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={remove} />
    </>
  ));
}
