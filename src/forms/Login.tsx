import * as React from 'react';
import {Button, Flex, useColorModeValue, useToast} from '@chakra-ui/react';
import { EmailField } from '../components/inputs/Email';
import { PasswordField } from '../components/inputs/Password';
import { AuthenticationApi, Configuration } from '../axiosClient';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { useStores } from '../stores';

export const LoginForm = () => {
  const history = useHistory();
  const toast = useToast()
  const {appStore} = useStores();

  const [email, setEmail] = React.useState<string>('');
  const [password, setPassword] = React.useState<string>('');
  const [loading, setLoading] = React.useState<boolean>(false);
  const bg = useColorModeValue('gray.300', 'gray.500');
  const userApi = new AuthenticationApi(new Configuration({}), 'http://localhost:8080/api', axios);
  const login = () => {
    setLoading(true);
    userApi.authLoginPost({email, password}).then(response => {
      if(response.status === 200 && response.data.token) {
        appStore.login(response.data.token);
        setLoading(false);
        history.push("/");
      } else {
        setLoading(false);
        toast({
          title: "Login failed.",
          description: "fail",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }).catch(error => {
      setLoading(false);
      console.log(error);
      toast({
        title: "Error during request.",
        description: "Network error",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    });
  };
  return (
    <Flex p={8} direction="column" rounded={10} bgColor={bg}>
      <EmailField value={email} setValue={setEmail} />
      <PasswordField value={password} setValue={setPassword} />
      <Button mt={4} colorScheme="gray" isLoading={loading} onClick={login}>Login</Button>
    </Flex>
  );
}