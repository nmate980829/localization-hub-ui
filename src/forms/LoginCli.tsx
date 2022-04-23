import * as React from 'react';
import {Button, Flex, Heading, Spinner, useColorModeValue, useToast} from '@chakra-ui/react';
import { EmailField } from '../components/inputs/Email';
import { PasswordField } from '../components/inputs/Password';
import { AccessTokenDto, AuthenticationApi, Configuration, TokenDto, UserResponse, UsersApi } from '../client';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';
import { useStores } from '../stores';
import { useApi } from '../hooks/useApi';
import { useAlert } from '../hooks/useAlert';
import { useObserver } from 'mobx-react';
import { CheckIcon } from '@chakra-ui/icons';

export const LoginCliForm = () => {
  const history = useHistory();
  const toast = useToast()
  const {appStore} = useStores();
  const search = useLocation().search;
  const port = new URLSearchParams(search).get('port');
  const hostname = new URLSearchParams(search).get('hostname');

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const [finished, setFinished] = React.useState<boolean>(false);
  const bg = useColorModeValue('gray.300', 'gray.500');
  const {authApi, tokenApi} = useApi();
  const {error} = useAlert();
  const login = async () => {
    setLoading(true);
    try {
      const access = (await authApi.authLogin({email, password, tokenDescription: 'Web ui'})).data.data as AccessTokenDto;
      const tokenRes = await authApi.authClaim({ access: access.access });
      const token = tokenRes.data.data as TokenDto;
      appStore.login(token);
      const userApi = new UsersApi(new Configuration({ accessToken: token.token }), token.server);
      const user = await userApi.usersGetMe({});
      appStore.syncMe(user.data.data as UserResponse);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      error('Error during logging in.')
    }
      
  };
  const passToken = async () => {
    const token = (await tokenApi.tokensCreate({tokenDescription: hostname || 'cli'})).data.data as AccessTokenDto;
    await axios.post(`http://localhost:${port}/auth/login`, token);
    setFinished(true);
  };
  React.useEffect(() => {
    if (appStore.isLoggedIn)
      passToken();
  }, [appStore.isLoggedIn])
  return useObserver(() => {
    if (finished){
      return (
        <Flex p={16} px={24} direction="column" rounded={10} bgColor={bg} align="center">
          <CheckIcon boxSize="24" mb={8} color="green.500" />
          <Heading>Successfully Logged in CLI</Heading>
        </Flex>
      );
    }
    return appStore.isLoggedIn ? 
      <Flex p={8} direction="column" rounded={10} bgColor={bg} align="center">
        <Heading>Logging in CLI...</Heading>
        <Spinner
          thickness='12px'
          speed='0.65s'
          emptyColor='gray.200'
          color='blue.700'
          size='xl'
        />
      </Flex>
    :
      <Flex p={8} direction="column" rounded={10} bgColor={bg}>
        <EmailField value={email} setValue={setEmail} />
        <PasswordField value={password} setValue={setPassword} />
        <Button mt={4} colorScheme="gray" isLoading={loading} onClick={login}>Login</Button>
      </Flex>
  });
}