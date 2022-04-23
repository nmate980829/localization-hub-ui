import * as React from 'react';
import {Button, Divider, Flex, Heading, useColorModeValue, useToast} from '@chakra-ui/react';
import { EmailField } from '../components/inputs/Email';
import { PasswordField } from '../components/inputs/Password';
import { AccessTokenDto, Invite, RegisterDto, TokenDto } from '../client';
import { useHistory, useParams } from 'react-router-dom';
import { useStores } from '../stores';
import { NameField } from '../components/inputs/Name';
import { useApi } from '../hooks/useApi';

export const RegisterForm = () => {
  const history = useHistory();
  const toast = useToast()
  const {appStore} = useStores();
  let {token} = useParams<{token:string}>();
  const [state, setState] = React.useState<RegisterDto>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState<boolean>(false);
  const bg = useColorModeValue('gray.300', 'gray.500');
  const {authApi} = useApi();
  const login = () => {
    setLoading(true);
    authApi.authRegister(token, {...state, tokenDescription: 'Web ui'}).then(response => {
          
      if(response.status === 201 && response.data.data) {
        authApi.authClaim({ access: (response.data.data as AccessTokenDto).access }).then(resp => {
          appStore.login(resp.data.data as TokenDto);
          setLoading(false);
          history.push("/");
        })
      } else {
        setLoading(false);
        toast({
          title: "Register failed.",
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
  React.useEffect(() => {
    authApi.authRegisterProbe(token).then(response => {
      if (response.status === 200) {
        setState({
          ...state,
          email: (response.data.data as Invite).email || '',
        })
      }
    });
  }, []);
  return (
    <Flex p={8} direction="column" rounded={10} bgColor={bg}>
      <Heading alignSelf="center" className="registerHeading">Register</Heading>
      <Divider mb={4} mt={2} />
      <NameField value={state.firstName} setValue={(firstName) => setState({...state, firstName})} label='First name' id='firstName' placeholder='Jane' />
      <NameField value={state.lastName} setValue={(lastName) => setState({...state, lastName})} label='Last name' id='lastName' placeholder='Doe'/>
      <EmailField value={state.email} setValue={(email) => setState({...state, email})} />
      <PasswordField value={state.password} setValue={(password) => setState({...state, password})} />
      <Button mt={4} colorScheme="gray" isLoading={loading} onClick={login}>Register</Button>
    </Flex>
  );
}