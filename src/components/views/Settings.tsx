import * as React from "react";
import {
  Link, useHistory, useParams
} from "react-router-dom";
import { Avatar, Badge, Box, Button, Circle, Divider, Flex, FormLabel, Heading, HStack, IconButton, LinkBox, LinkOverlay, Select, Skeleton, Stack, Text, Tooltip, useColorModeValue, useDisclosure, useRadio, useToast, Wrap } from '@chakra-ui/react';
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
import { SERVERROLE, UserResponse } from '../../client';
import { NameField } from '../inputs/Name';
import { EmailField } from '../inputs/Email';
import { PasswordField } from '../inputs/Password';
import { useAlert } from '../../hooks/useAlert';

dayjs.extend(LocalizedFormat);

export const SettingsView: React.FC<UserProps> = ({ }) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const { appStore } = useStores();
  const userId = useObserver(() => appStore.user?.id );
  const [firstName, setFirstName] = React.useState<string>('');
  const [lastName, setLastName] = React.useState<string>('');
  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [confirm, setConfirm] = React.useState<string>('');
  const [role, setRole] = React.useState<SERVERROLE>();
  const [shouldRefresh, setRefresh] = React.useState<number>(0);
  const [dialog, setDialog] = React.useState<number>(0);
  const refresh = () => setRefresh(shouldRefresh + 1);
  const {loadAlert, success, error} = useAlert();
  const history = useHistory();

  const {userApi} = useApi();

  const updateInfo = () => userApi.usersUpdateMe({firstName, lastName, email}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated your account');
    }
  });


  const updatePassword = () => userApi.usersUpdateMe({password}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated your password');
    }
  });

  const updateRole = () => userApi.usersUpdate(userId!!, {role}).then((response) => {
    if (response.status === 200) {
      refresh();
      success('You updated your role');
    }
  });

  const deleteAccount = () => userApi.usersDeleteMe({ password: confirm }).then((response) => {
    if (response.status === 200) {
      setDialog(0)
      appStore.logout()
      history.push('/')
      success('You deleted your account');
    }
  }).catch((err) => {
    if (err.response.status === 409) {
      setDialog(0);
      error('You own projects and you can not abandon them, you have to transfer the rights before you can delete your account.')
    }
  });

  React.useEffect(() => {
    appStore.refresh();
    userApi.usersGetMe().then(response => {
      if (response.status === 200 && response.data.data) {
        const user = (response.data.data as UserResponse);
        setFirstName(user.firstName || '')
        setLastName(user.lastName || '')
        setEmail(user.email)
        setRole(user.role)
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

  const options = useObserver(() =>
    Object.entries(SERVERROLE)
      .filter(entry => appStore.role === SERVERROLE.Admin || entry[1] !== SERVERROLE.Admin)
      .map(entry => (<option value={entry[1]} key={entry[1]}>{entry[0]}</option>))
    );

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
          <Heading className="settingsHeading" >Settings</Heading>
          <Stack spacing={8} my={8}>
            <Wrap direction="row">
              <Heading size="md">Personal info</Heading>
              <Divider mb={4} mt={2} />
              <NameField value={firstName} setValue={(value) => setFirstName(value)} label="First Name" id="id" placeholder="Firstname" className="firstNameField" />
              <NameField value={lastName} setValue={(value) => setLastName(value)} label="Last Name" id="id2" placeholder="Lastname" className="lastNameField" />
              <EmailField value={email} setValue={(value) => setEmail(value)} />
              <Button bgColor="green.500" onClick={updateInfo} className="submitButton" >Save</Button>
            </Wrap>
            <Box>
              <Heading size="md">Change your password</Heading>
              <Divider mb={4} mt={2} />
              <PasswordField value={password} setValue={(value) => setPassword(value)} />
              <Button onClick={updatePassword}>Set password</Button>
            </Box>

            {(appStore.user?.role === SERVERROLE.Admin || appStore.user?.role === SERVERROLE.Hr) &&
                <Box>
                  <Heading size="md">Change your role</Heading>
                  <Divider mb={4} mt={2} />
                  <FormLabel htmlFor="role">Select your new role</FormLabel>
                  <Select id="role" defaultValue={SERVERROLE.User} value={role} onChange={(event) => setRole(event.target.value as SERVERROLE)}>
                    {options}
                  </Select>
                  <Button mt={4} mb={2} onClick={updateRole}>Set role</Button>
                </Box>
            }
            <Box>
              <Heading size="md">Delete your account</Heading>
              <Divider mb={4} mt={2} />
              <PasswordField value={confirm} setValue={(value) => setConfirm(value)} />
              <Button bgColor="red.500" aria-label="Delete your account" onClick={() => setDialog(1)} >Delete account</Button>
            </Box>
          </Stack>
        </MotionFlex>
      </MotionFlex>
      <Confirm title='Delete Account'
        description={`Are you sure you want to delete your account? You can't undo this action afterwards.`}
        actionName='Delete'
        isOpen={appStore.user?.id !== undefined && dialog === 1}
        onClose={() => setDialog(0)}
        action={deleteAccount} />
    </>
  ));
}
