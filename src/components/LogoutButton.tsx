import {
  IconButton,
  Icon,
} from "@chakra-ui/react"
import { FaDoorOpen } from "react-icons/fa"
import { useHistory } from 'react-router-dom';
import { useStores } from '../stores'

export const LogoutButton = () => {
  const {appStore} = useStores();
  const history = useHistory();
  const logout = () => {
    appStore.logout();
    history.replace('/');
  };
  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={logout}
      icon={<Icon as={FaDoorOpen} />}
      aria-label="Log out"
      className="logoutButton"
    />
  )
}
