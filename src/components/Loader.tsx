import * as React from "react"
import {
  Box, Center,
} from "@chakra-ui/react";
import { motion } from 'framer-motion';
const MotionBox = motion(Box);
export const Loader = () => (
  <Center w={80} h={100} >
    <MotionBox borderTop="8px" w={100} h={100} rounded="full" animate={{rotate: [0, 360]}} transition={{repeat: Infinity}}></MotionBox>
  </Center>
)
