import axios from 'axios';
import { useObserver } from 'mobx-react';
import { AccessApi, AuthenticationApi, BranchesApi, Configuration, IdentifiersApi, InvitationsApi, LanguagesApi, ProjectsApi, RightsApi, RolesApi, TokensApi, TranslationsApi, UsersApi } from '../client';
import { useStores } from '../stores';

export const useApi = () => {
  const {appStore} = useStores();
  const config = useObserver(() => new Configuration({ accessToken: appStore.token?.token }));
  
  const userApi = new UsersApi(config, appStore.token?.server);
  const inviteApi = new InvitationsApi(config, appStore.token?.server);
  const projectApi = new ProjectsApi(config, appStore.token?.server);
  const languageApi = new LanguagesApi(config, appStore.token?.server);
  const branchApi = new BranchesApi(config, appStore.token?.server);
  const identifierApi = new IdentifiersApi(config, appStore.token?.server);
  const translationApi = new TranslationsApi(config, appStore.token?.server);
  const tokenApi = new TokensApi(config, appStore.token?.server);
  const accessApi = new AccessApi(config, appStore.token?.server);
  const roleApi = new RolesApi(config, appStore.token?.server);
  const rightApi = new RightsApi(config, appStore.token?.server);
  const authApi = new AuthenticationApi(new Configuration({}), process.env.REACT_APP_API_URL);

  return {
    userApi,
    inviteApi,
    projectApi,
    languageApi,
    branchApi,
    identifierApi,
    translationApi,
    tokenApi,
    accessApi,
    roleApi,
    rightApi,
    authApi,
  };
}
