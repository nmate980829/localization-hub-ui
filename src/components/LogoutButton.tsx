import {
  IconButton,
  Icon,
} from "@chakra-ui/react"
import { FaDoorOpen } from "react-icons/fa"
import { useStores } from '../stores'

export const LogoutButton = () => {
  const {appStore} = useStores();
  return (
    <IconButton
      size="md"
      fontSize="lg"
      variant="ghost"
      color="current"
      marginLeft="2"
      onClick={appStore.logout}
      icon={<Icon as={FaDoorOpen} />}
      aria-label="Log out"
    />
  )
}
