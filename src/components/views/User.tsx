import * as React from "react";
import {
  useHistory, useParams
} from "react-router-dom";
import { Badge, Box, Button, Circle, Divider, FormLabel, Heading, HStack, Select, Stack, Text, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { MotionFlex } from '../Motion';
import { motion } from 'framer-motion';
import { UserProps } from './types';
import { useApi } from '../../hooks/useApi';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { Confirm } from '../Confirm';
import { SERVERROLE, UserResponse } from '../../client';
import { useAlert } from '../../hooks/useAlert';
import { BackButton } from '../BackButton';

const MotionBox = motion(Box);
const MotionCircle = motion(Circle);
dayjs.extend(LocalizedFormat);

export const UserView: React.FC<UserProps> = ({ }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  let id = Number.parseInt(useParams<{id: string}>().id);
  const { appStore } = useStores();
  const userId = useObserver(() => appStore.user?.id );
  const [user, setUser] = React.useState<UserResponse | undefined>(undefined);
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const refresh = () => setRefresh(shouldRefresh + 1);

  const {userApi} = useApi();

  const [email, setEmail] = React.useState<string>('');
// TODO: resetPAssword
  const [role, setRole] = React.useState<SERVERROLE>();
  const {loadAlert, success, error} = useAlert();
  const history = useHistory();

  const resetPassword = () => userApi.usersReset(id!!).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You reset the user\'s password');
    }
  });

  const logout = () => userApi.usersLogout(id!!).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You logged the user out');
    }
  });

  const updateRole = () => userApi.usersUpdate(id!!, {role}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated the user\'s role');
    }
  });

  const disableAccount = (disabled: boolean = true) => userApi.usersUpdate(id!!, { disabled }).then((response) => {
    if (response.status === 200) {
      setDialog(0);
      refresh();
      success('You disabled the user\'s account');
    }
  });


  const deleteAccount = () => userApi.usersRemove(id!!).then((response) => {
    if (response.status === 200) {
      setDialog(0);
      history.push('/users');
      success('You deleted the user\'s account');
    }
  }).catch((err) => {
    if (err.response.status === 409) {
      setDialog(0);
      error('This user owns projects and they can not abandon them, you have to transfer the rights before you can delete the account.')
    }
  });


  const options = useObserver(() =>
    Object.entries(SERVERROLE)
      .filter(entry => appStore.role === SERVERROLE.Admin || entry[1] !== SERVERROLE.Admin)
      .map(entry => (<option value={entry[1]} key={entry[1]}>{entry[0]}</option>))
    );

  React.useEffect(() => {
    appStore.refresh();
    userApi.usersFindOne(id || -1).then(response => {
      if (response.status === 200 && response.data.data) {
        const user = response.data.data as UserResponse
        setUser(user);
        setRole(user.role);
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
          <HStack w="100%"> 
            <BackButton goBack={() => history.push('/users')} />
            <Heading alignSelf="center">User: {user?.email}</Heading>
          </HStack>
          <Stack spacing={8} my={8}>
            <Stack>
              <HStack>
                <Heading size="md">Personal info</Heading>
                {user?.disabled &&
                  <Badge variant="solid" colorScheme="blackAlpha" mx={10} fontSize="lg" rounded={10} p={1} px={6} >Disabled</Badge>
                }
              </HStack>
              <Divider mb={4} mt={2} />
              <HStack>
                <Heading size="sm">Firstname: </Heading>
                <Text >{user?.firstName}</Text>  
              </HStack>
              <HStack>
                <Heading size="sm">Lastname: </Heading>
                <Text >{user?.lastName}</Text>  
              </HStack>
              <HStack>
                <Heading size="sm">Email: </Heading>
                <Text >{user?.email}</Text>  
              </HStack>
              <HStack>
                <Heading size="sm">Role: </Heading>
                <Badge variant="solid" colorScheme="teal" mx={10} fontSize="lg" rounded={10} p={1} px={6} >{user?.role}</Badge>
              </HStack>

            </Stack>
            {(appStore.user?.role === SERVERROLE.Admin || (appStore.user?.role === SERVERROLE.Hr && user?.role !== SERVERROLE.Admin)) &&
              <>
                <Box>
                  <Heading size="md">Change the user's role</Heading>
                  <Divider mb={4} mt={2} />
                  <FormLabel htmlFor="role">Select the user's new role</FormLabel>
                  <Select id="role" defaultValue={SERVERROLE.User} value={role} onChange={(event) => setRole(event.target.value as SERVERROLE)}>
                    {options}
                  </Select>
                  <Button mt={4} mb={2} onClick={updateRole}>Set role</Button>
                </Box>
                <Box>
                  <Heading size="md">Reset the user's password</Heading>
                  <Divider mb={4} mt={2} />
                  <Text>A new generated password will be sent to the user in an email.</Text>
                  <Button onClick={resetPassword}>Reset password</Button>
                </Box>
                <Box>
                  <Heading size="md">Log the user out</Heading>
                  <Divider mb={4} mt={2} />
                  <Text>Their authentication tokens will be invalidated. They have to login again</Text>
                  <Button onClick={logout}>Logout user</Button>
                </Box>
                <Box>
                  <Heading size="md">{user?.disabled ? 'Enable' : 'Disable'} the user</Heading>
                  <Divider mb={4} mt={2} />
                  <Text>A disabled user is not able to login again until someone enables their account.</Text>
                  <Button onClick={() => setDialog(2)}>{user?.disabled ? 'Enable' : 'Disable'} user</Button>
                </Box>
                <Box>
                  <Heading size="md">Delete the user's account</Heading>
                  <Divider mb={4} mt={2} />
                  <Text mb={4}>The user will be permanently deleted, if you are unsure please use the disable function instead. They won't be able to login or perform actions while disabled, but that is a reversable action</Text>
                  <Button bgColor="red.500" aria-label="Delete the user's account" onClick={() => setDialog(1)} >Delete account</Button>
                </Box>
              </>
            }
          </Stack>
        </MotionFlex>
      </MotionFlex>
      <Confirm title='Delete user'
        description={`Are you sure you want to delete the user ${user?.firstName}? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={user !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={deleteAccount} />
      <Confirm title={`${user?.disabled ? 'Enable' : 'Disable'} user`}
        description={`Are you sure you want to ${user?.disabled ? 'Enable' : 'Disable'} the user ${user?.firstName}? You can ${user?.disabled ? 'Disable' : 'Enable'} him anytime later`}
        actionName={user?.disabled ? 'Enable' : 'Disable'}
        isOpen={user !== undefined && dialog === 2}
        onClose={() => setDialog(0)}
        action={() => disableAccount(!user?.disabled)} />
    </>
  ));
}
