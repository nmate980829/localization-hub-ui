import * as React from "react";
import {
  Link
} from "react-router-dom";
import {Box, Flex, Link as ChakraLink, Text, useColorModeValue} from '@chakra-ui/react';
import { DrawerItemProps as Props } from './types';
import { MotionFlex } from '../Motion';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

export const DrawerItem: React.FC<Props> = ({path, display, icon}) => {
  const bg = useColorModeValue('gray.300', 'gray.500');
  const from = useColorModeValue('gray.400', 'teal.700');
  const variants = {
    hidden: { marginLeft: '-100%'},
    show: {
      marginLeft: '0%',
      transition: {
        type: 'tween',
      }
    }
  };
  return (
      <Link to={path}>
        <MotionFlex
          position="relative"
          direction="row"
          align="center"
          w="100%"
          variants={variants}
          backgroundSize="200%"
          backgroundPosition="100%"
          backgroundRepeat="no-repeat"
          bgGradient={`linear(to-r, ${from}, ${bg}, ${bg})`}
          transition={{type: 'tween'}}
          whileHover={{backgroundPosition: "0%", transition: {type: 'tween'}}}
          >
          <Flex
            direction="row"
            align="center"
            zIndex={1}
            m={5}
            >
            {icon}
            <Text mx={3}>{display}</Text>
          </Flex>
        </MotionFlex>
      </Link>
  );
}

//



/* 

<Link to={path}>
<MotionFlex
  position="relative"
  direction="row"
  align="center"
  w="100%"
  variants={variants}
  backgroundSize="0%"
  backgroundRepeat="no-repeat"
  bgGradient={`linear(to-r, ${from}, ${bg})`}
  transition={{type: 'tween'}}
  whileHover={{backgroundSize: "100%", transition: {type: 'tween'}}}
  >
  <Flex
    direction="row"
    align="center"
    zIndex={1}
    m={5}
    >
    {icon}
    <Text mx={3}>{display}</Text>
  </Flex>
</MotionFlex>
</Link> */