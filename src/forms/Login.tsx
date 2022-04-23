import * as React from 'react';
import {Button, Divider, Flex, Heading, useColorModeValue, useToast} from '@chakra-ui/react';
import { EmailField } from '../components/inputs/Email';
import { PasswordField } from '../components/inputs/Password';
import { AccessTokenDto, AuthenticationApi, Configuration, TokenDto, UserResponse, UsersApi } from '../client';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useStores } from '../stores';
import { useApi } from '../hooks/useApi';
import { useAlert } from '../hooks/useAlert';

export const LoginForm = () => {
  const history = useHistory();
  const toast = useToast()
  const {appStore} = useStores();

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const bg = useColorModeValue('gray.300', 'gray.500');
  const {authApi} = useApi();
  const {error} = useAlert();
  const login = async () => {
    setLoading(true);
    try {
      const access = await authApi.authLogin({email, password, tokenDescription: 'Web ui'});
      const tokenRes = await authApi.authClaim({ access: (access.data.data as AccessTokenDto).access });
      const token = tokenRes.data.data as TokenDto;
      appStore.login(token);
      const userApi = new UsersApi(new Configuration({ accessToken: token.token }), token.server);
      const user = await userApi.usersGetMe({});
      appStore.syncMe(user.data.data as UserResponse);
      setLoading(false);
      history.push("/"); 
    } catch (err) {
      setLoading(false);
      error('Error during logging in.')
    }
      
  };
  return (
    <Flex p={8} direction="column" rounded={10} bgColor={bg}>
      <Heading alignSelf="center" className="loginHeading">Login</Heading>
      <Divider mb={4} mt={2} />
      <EmailField value={email} setValue={setEmail} />
      <PasswordField value={password} setValue={setPassword} />
      <Button mt={4} colorScheme="gray" isLoading={loading} onClick={login} className="submitButton" >Login</Button>
    </Flex>
  );
}