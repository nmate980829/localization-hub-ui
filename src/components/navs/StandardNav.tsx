import * as React from "react"
import {Flex} from '@chakra-ui/react';
import { ColorModeSwitcher } from '../ColorModeSwitcher';
import { NavProps } from './types';
import { NavItem } from './NavItem';
import { NavItemProps as Item } from './types';
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { LogoutButton } from '../LogoutButton';

const publicNav: Item[] = [
  {
    path: '/login',
    display: 'Login'
  },
  {
    path: '/register',
    display: 'Register'
  }
];
const privateNav: Item[] = [
  {
    path: '/settings',
    display: 'Settings'
  }
];

const navItems = (items: Item[]) => items.map(item => (<NavItem path={item.path} display={item.display} key={Math.random()} />));

export const StandardNav = () => {
  const {appStore} = useStores();
  return useObserver(() => (
    <Flex align="center" as="nav" mr={10}>
      {navItems(appStore.isLoggedIn ? privateNav : publicNav)}
      <ColorModeSwitcher ml={6} />
      {appStore.isLoggedIn && <LogoutButton />}
    </Flex>
  ));
}



