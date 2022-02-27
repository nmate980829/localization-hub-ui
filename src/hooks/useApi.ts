import axios from 'axios';
import { useObserver } from 'mobx-react';
import { AuthenticationApi, Configuration, InvitesApi, UsersApi } from '../axiosClient';
import { useStores } from '../stores';

export const useApi = () => {
  const {appStore} = useStores();
  const token = useObserver(() => `Bearer ${appStore.token}`);
  const axiosInstance = axios.create();
  axiosInstance.defaults.headers.common['Authorization'] = token;
  
  const userApi = new UsersApi(new Configuration({}), 'http://localhost:8080/api', axiosInstance);
  const inviteApi = new InvitesApi(new Configuration({}), 'http://localhost:8080/api', axiosInstance);
  const authApi = new AuthenticationApi(new Configuration({}), 'http://localhost:8080/api', axios);

  return {
    userApi,
    inviteApi,
    authApi,
  };
}
