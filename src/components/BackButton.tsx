import { ArrowBackIcon } from '@chakra-ui/icons';
import { Square, useColorModeValue } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

export const Control = motion(Square);
export const BackButton: React.FC<{goBack(): void}> = ({goBack}) => {
  const backBg = useColorModeValue('gray.200', 'gray.400');
  return (
    <Control
      onClick={goBack}
      bgColor={backBg}
      p={3}
      px={4}
      as="button"
      borderRadius="xl"
      layout
      whileHover={{scale: 1.1}}
      alignSelf="start"
      mr={4}
      >
      <ArrowBackIcon />
    </Control>
  );
};