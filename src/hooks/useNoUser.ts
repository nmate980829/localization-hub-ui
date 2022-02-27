import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom';
import { useStores } from '../stores';

export const useNoUser = () => {
  const {appStore} = useStores();
  const history = useHistory();
  useObserver(() => {
    if (appStore.isLoggedIn) history.push('/');
  });
}
