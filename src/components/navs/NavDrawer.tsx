import { useDisclosure } from '@chakra-ui/hooks'
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay } from '@chakra-ui/react'
import * as React from "react"

export const NavDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const btnRef = React.useRef()

  return (
    <Drawer
      isOpen={true}
      placement="left"
      isFullHeight={false}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Create your account</DrawerHeader>

        <DrawerBody>
        </DrawerBody>

        <DrawerFooter>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}