import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { SERVERROLE as Role } from '../client';
import { useStores } from '../stores';

export const useRole = (role?: Role) => {
  const {appStore} = useStores();
  const history = useHistory();
  useObserver(() => {
    if (!appStore.isLoggedIn) history.push('/');
    if (role === undefined) return;
    if (appStore.role === Role.Admin) return;
    if (appStore.role !== role) history.push('/');
  });
}
