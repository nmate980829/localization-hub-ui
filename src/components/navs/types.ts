import { ReactNode } from 'react';

export interface NavProps {
  items: NavItemProps[];
}

export interface NavItemProps {
  path: string;
  display: string;
}

export interface DrawerItemProps extends NavItemProps {
  icon: ReactNode;
}