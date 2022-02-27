import * as React from "react";
import {
  Link
} from "react-router-dom";
import {Link as ChakraLink, useColorModeValue} from '@chakra-ui/react';
import { NavItemProps as Props } from './types';

export const NavItem: React.FC<Props> = ({path, display}) => {
  const activeBg = useColorModeValue('gray.300', 'teal.600');
  return (
      <Link to={path}>
        <ChakraLink
          p={6}
          px={10}
          _hover={{
            backgroundColor: activeBg,
          }}>
          {display}
        </ChakraLink>
      </Link>
  );
}







