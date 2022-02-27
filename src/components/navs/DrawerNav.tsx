import * as React from "react"
import { Box, Button, Circle, CloseButton, Flex, Heading, Icon, Slide, Square, useColorModeValue } from '@chakra-ui/react'
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { ArrowRightIcon, EmailIcon } from '@chakra-ui/icons';
import { MotionFlex } from '../Motion';
import { motion } from 'framer-motion';
import { UserResponseRoleEnum } from '../../axiosClient';
import { DrawerItemProps } from './types';
import { FaFileInvoice, FaUsers } from 'react-icons/fa';
import { DrawerItem } from './DrawerItem';

const Control = motion(Square);
export type NavGroup = {
  [key in UserResponseRoleEnum]: DrawerItemProps[]
}

export const NavGroups: NavGroup = {
  USER: [
    {
      path: '/projects',
      display: 'Projects',
      icon: <Icon as={FaFileInvoice} />
    },
    {
      path: '/projects',
      display: 'Translations',
      icon: <Icon as={FaFileInvoice} />
    },
    {
      path: '/projects',
      display: 'ServerRoles',
      icon: <Icon as={FaFileInvoice} />
    },
    {
      path: '/projects',
      display: 'Projects',
      icon: <Icon as={FaFileInvoice} />
    }
  ],
  PO: [
    {
      path: '/projects',
      display: 'Projects',
      icon: <Icon as={FaFileInvoice} />
    }
  ],
  HR: [
    {
      path: '/invites',
      display: 'Invitations',
      icon: <EmailIcon />
    },
    {
      path: '/users',
      display: 'Users',
      icon: <Icon as={FaUsers} />
      //FaRegUserCircle
      //FaUserCircle
      //FaUserFriends
    }
  ],
  ADMIN: [
    {
      path: '/projects',
      display: 'Projects',
      icon: <Icon as={FaFileInvoice} />
    }
  ]
};

const ItemGenerator = (items: DrawerItemProps[]) => items.map(props => (<DrawerItem key={Math.random()} {...props}/>));

export const DrawerNav = () => {
  const {appStore} = useStores();
  const bg = useColorModeValue('gray.300', 'gray.500');
  const icon = useColorModeValue('gray.400', 'teal.700');
  const container = {
    hidden: { marginLeft: '-20%'},
    show: {
      marginLeft: '0%',
      transition: {
        delayChildren: 0.2,
        type: 'tween',
        staggerChildren: 0.2
      }
    }
  }

  return useObserver(() => (
    <>
      <Control
        position="fixed"
        top={20}
        left={5}
        zIndex={11}
        onClick={appStore.drawerOpen ? appStore.closeDrawer : appStore.openDrawer}
        bgColor={icon}
        p={5}
        as="button"
        borderRadius="xl"
        animate={{rotate: appStore.drawerOpen ? 180 : 0, left: appStore.drawerOpen ? '21%': '1%'}}
        >
        <ArrowRightIcon />
      </Control>
      <MotionFlex
        w="20%"
        h="100%"
        direction="column"
        bgColor={bg}
        zIndex={10}
        animate={appStore.drawerOpen ? 'show' : 'hidden'}
        variants={container}
        initial="hidden"
        >
        <Heading p={5}>Menu</Heading>
        <Flex direction="column">
        {appStore.role && ItemGenerator(NavGroups[appStore.role])}
        </Flex>
      </MotionFlex>
    </>
  ));
}