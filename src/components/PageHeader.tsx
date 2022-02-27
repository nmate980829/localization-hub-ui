import * as React from "react"
import {
  Box, Center, Circle, Flex, Heading, useColorModeValue,
} from "@chakra-ui/react";
import { PageHeaderProps } from './types';
import { AddIcon, RepeatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { MotionCircle } from './Motion';

export const PageHeader: React.FC<PageHeaderProps> = ({title, refresh, create}) => {
  const bg = useColorModeValue('purple.100', 'gray.700');
  return (
    <Flex  w="100%" p={10} align="center" justify="flex-end" flexDir="row" bgColor={bg}>
      <Heading>{title}</Heading>
      <MotionCircle ml={4} size="10" onClick={refresh} _hover={{bgColor:'gray.600'}} whileTap={{scale: 1.1}} >
        <RepeatIcon boxSize="8" />
      </MotionCircle>
      {create && 
        <MotionCircle ml={4} size="10" onClick={create} _hover={{bgColor:'gray.600'}} whileTap={{scale: 1.1}} >
          <AddIcon boxSize="6" />
        </MotionCircle>
      }
    </Flex>
  );
}
