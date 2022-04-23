import * as React from "react"
import {
  Box,
  VStack,
  Grid,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import { Logo } from '../../Logo';
import { Link } from 'react-router-dom';
import { Loader } from '../../components/Loader';
import { useStores } from '../../stores';

export const FrontPage = () => {
  const {appStore} = useStores();
  return (
    <VStack spacing={8} textAlign="center" justify="center" w="100%" h="100%" fontSize="xl">
      <Heading className="welcomeText" >Welcome to Locahub!</Heading>
      <Text>This is the {process.env.REACT_APP_NAME} Localization project</Text>
      <Link to="/projects">
        <Button>Check out the projects!</Button>
      </Link>
    </VStack>
  );
}
