import * as React from "react"
import {
  Box,
  VStack,
  Grid,
  Button,
  Center,
  useColorModeValue,
  Heading,
  HeadingProps,
  Circle,
  Flex,
  Spacer,
  SlideFade,
} from "@chakra-ui/react";
import { Logo } from '../Logo';
import { motion, useAnimation } from 'framer-motion';

const MotionCircle = motion(Circle);

export const LoaderOverlay = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const circlebg = useColorModeValue('teal.400', 'teal.600');
  const [state, setState] = React.useState<boolean>(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => setState(true), 30000);
    return () => clearTimeout(timeout);
  }, []);
  return (
    <Center w="100vw" h="100vh" position="fixed" top={0} left={0} bgColor={bg} zIndex={1000} flexDirection="column">
      <Spacer />
      <Flex h={228} align="flex-end">
        <MotionCircle animate={{marginBottom: [0, 128,0], scale: [1, 1.3,1]}} transition={{repeat: Infinity, repeatDelay: 0.75, duration: 0.5}} pointerEvents="none" bgColor={circlebg} size={100}><Heading>ポ</Heading></MotionCircle>
        <MotionCircle animate={{marginBottom: [0, 128,0], scale: [1, 1.3,1]}} transition={{repeat: Infinity, repeatDelay: 0.75, delay: 0.1875, duration: 0.5}} pointerEvents="none" mx={10} bgColor={circlebg} size={100}><Heading>ض</Heading></MotionCircle>
        <MotionCircle animate={{marginBottom: [0, 128,0], scale: [1, 1.3,1]}} transition={{repeat: Infinity, repeatDelay: 0.75, delay: 0.375, duration: 0.5}} pointerEvents="none" bgColor={circlebg} size={100}><Heading>丈</Heading></MotionCircle>
      </Flex>
      <SlideFade in={state}>
        <Heading mt={10} w={600} textAlign="center" display="block">Please refresh the website, if you are still waiting after a few minutes.</Heading>
      </SlideFade>
      <Spacer/>
    </Center>
  );
}
