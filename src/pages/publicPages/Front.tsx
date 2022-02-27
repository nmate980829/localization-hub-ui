import * as React from "react"
import {
  Box,
  VStack,
  Grid,
  Button,
} from "@chakra-ui/react";
import { Logo } from '../../Logo';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { useStores } from '../../stores';

export const FrontPage = () => {
  const {appStore} = useStores();
  return (
    <Box textAlign="center" w="100%" fontSize="xl">
      <Grid minH="100%" minW="100%" p={10}>
        <VStack spacing={8}>
          <Logo h="40vmin" pointerEvents="none" />
        </VStack>
        <Loader />
        <Link to="/login">
          <Button colorScheme="teal" onClick={appStore.load}>Login</Button>
        </Link>
      </Grid>
    </Box>
  );
}
