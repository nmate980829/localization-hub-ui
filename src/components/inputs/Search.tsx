import * as React from 'react';
import {
  Button,
  Circle,
  Flex, Input, InputGroup, InputLeftElement, InputRightElement,
} from "@chakra-ui/react";
import { InputProps } from './types';
import { CloseIcon, SearchIcon } from '@chakra-ui/icons';
import { MotionCircle } from '../Motion';

export const SearchInput: React.FC<InputProps> = ({value, setValue}) => (
    <Flex w="100%" p={6}>
      <InputGroup alignItems="center">
        <InputLeftElement
          pointerEvents="none"
          mb={1}
          children={<SearchIcon />}
        />
        <Input placeholder="Search"
          _placeholder={{color: "gray.300"}}
          bgColor="gray.800"
          value={value}
          rounded={20}
          onChange={(event) => setValue(event.target.value)}></Input>
        <InputRightElement width="3.0rem">
          <MotionCircle size="7" onClick={() => setValue('')} _hover={{bgColor:'gray.600'}} whileTap={{scale: 1.1}}>
            <CloseIcon boxSize={3} mb={0} />
          </MotionCircle>
        </InputRightElement>
      </InputGroup>
      
    </Flex>
);