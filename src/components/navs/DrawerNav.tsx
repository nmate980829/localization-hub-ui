import * as React from "react"
import { Box, Button, Circle, CloseButton, Flex, Heading, HStack, Icon, Slide, Square, useBreakpointValue, useColorModeValue } from '@chakra-ui/react'
import { useStores } from '../../stores';
import { useObserver } from 'mobx-react';
import { ArrowBackIcon, ArrowLeftIcon, ArrowRightIcon, EmailIcon } from '@chakra-ui/icons';
import { MotionFlex } from '../Motion';
import { motion } from 'framer-motion';
import { UserResponseRoleEnum } from '../../axiosClient';
import { DrawerItemProps } from './types';
import { FaAtlas, FaBookReader, FaCodeBranch, FaFileInvoice, FaUsers, FaUserShield } from 'react-icons/fa';
import { DrawerItem } from './DrawerItem';
import { useHistory, useParams, useRouteMatch } from 'react-router-dom';
import { SERVERROLE } from '../../client';

const Control = motion(Square);
export type NavGroup = {
  [key in UserResponseRoleEnum]: DrawerItemProps[]
}

export const NavItems: DrawerItemProps[] = [
  {
    path: '/projects',
    display: 'Projects',
    icon: <Icon as={FaFileInvoice} />
  },
  {
    path: '/users',
    display: 'Users',
    icon: <Icon as={FaUsers} />
    //FaRegUserCircle
    //FaUserCircle
    //FaUserFriends
  },
  {
    path: '/invites',
    display: 'Invitations',
    icon: <EmailIcon />
  },
  {
    path: '/roles',
    display: 'Roles',
    icon: <Icon as={FaUserShield} />
  }
];

export const ProjectNavItems: (id: string) => DrawerItemProps[] = (id: string) => ([
  {
    path: `/projects/${id}`,
    display: 'Details',
    icon: <Icon as={FaFileInvoice} />
  },
  {
    path: `/projects/${id}/access`,
    display: 'Access',
    icon: <Icon as={FaUserShield} />,
    // <Icon as={FaUsers} />
    //FaRegUserCircle
    //FaUserCircle
    //FaUserFriends
  },
  {
    path: `/projects/${id}/languages`,
    display: 'Languages',
    icon: <Icon as={FaAtlas} />
  },
  {
    path: `/projects/${id}/branches`,
    display: 'Branches',
    icon: <Icon as={FaCodeBranch} />
  },
  {
    path: `/projects/${id}/identifiers`,
    display: 'Identifiers',
    icon: <Icon as={FaBookReader} />
  },
]);


export const NavGroups: NavGroup = {
  USER: [
    NavItems[0],
    NavItems[1],
    NavItems[3],
  ],
  PO: [
    NavItems[0],
    NavItems[1],
    NavItems[3],
  ],
  HR: [
    ...NavItems,
  ],
  ADMIN: [
    ...NavItems,
  ]
};

const ItemGenerator = (items: DrawerItemProps[]) => items.map(props => (<DrawerItem key={Math.random()} {...props}/>));

export const DrawerNav = () => {
  const {appStore} = useStores();
  const projectId = useRouteMatch<{projectId: string}>('/projects/:projectId')?.params.projectId;
  const isProject = projectId !== undefined;
  const bg = useColorModeValue('gray.300', 'gray.500');
  const backBg = useColorModeValue('gray.200', 'gray.400');
  const icon = useColorModeValue('gray.400', 'teal.700');
  const history = useHistory();
  const goBack = () => history.push('/projects')
  const marginLeft = useBreakpointValue({base: '-100%', md: '-20%'})
  const buttonPosOpen = useBreakpointValue({base: '80%', md: '21%'})
  const buttonPosTop = useBreakpointValue({base: 24, sm: 20})
  const container = {
    hidden: { marginLeft },
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
        top={buttonPosTop}
        left={5}
        zIndex={11}
        onClick={appStore.drawerOpen ? appStore.closeDrawer : appStore.openDrawer}
        bgColor={icon}
        p={5}
        as="button"
        borderRadius="xl"
        animate={{rotate: appStore.drawerOpen ? 180 : 0, left: appStore.drawerOpen ? buttonPosOpen : '1%'}}
        >
        <ArrowRightIcon />
      </Control>
      <MotionFlex
        w={{base: '100%', md: '20%'}}
        h="100%"
        direction="column"
        bgColor={bg}
        zIndex={10}
        animate={appStore.drawerOpen ? 'show' : 'hidden'}
        variants={container}
        initial="hidden"
        >
        <HStack justify="space-between" pr={4}>
          <Heading p={5}>Menu</Heading>
          {isProject && 
            <Control
              onClick={goBack}
              bgColor={backBg}
              p={3}
              px={4}
              as="button"
              borderRadius="xl"
              layout
              whileHover={{scale: 1.1}}
              >
                <ArrowBackIcon />
            </Control>
          }
        </HStack>
        <Flex direction="column">
        {isProject ? ItemGenerator(ProjectNavItems(projectId)) : ItemGenerator(NavGroups[appStore.role || SERVERROLE.User])}
        </Flex>
      </MotionFlex>
    </>
  ));
}