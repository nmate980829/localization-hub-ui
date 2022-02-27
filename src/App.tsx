import * as React from "react"
import {
  ChakraProvider,
  theme,
} from "@chakra-ui/react";
import { MainRouter } from './pages';
import { createStores } from './stores';
import { Provider } from 'mobx-react';

export const App = () => {
  const stores = createStores();
  return (
    <ChakraProvider theme={theme}>
      <Provider {...stores}>
        <MainRouter />
      </Provider>
    </ChakraProvider>
  );
}
