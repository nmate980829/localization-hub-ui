import * as React from 'react';
import {FormControl, FormHelperText, FormLabel, Input, InputGroup, InputLeftElement, useColorModeValue} from '@chakra-ui/react';
import {EmailIcon} from '@chakra-ui/icons'
import { InputProps } from './types';

export const EmailField = React.forwardRef<HTMLInputElement, InputProps>(({value, setValue}, ref) => {
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <FormControl id="email" pb={4}>
      <FormLabel>Email address</FormLabel>
      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<EmailIcon />}
        />
        <Input type="email"
          placeholder="test@test.com"
          _placeholder={{color: placeholderColor}}
          value={value}
          ref={ref}
          onChange={event => setValue(event.target.value)}
          />
      </InputGroup>
      <FormHelperText>Please enter your e-mail in a correct format.</FormHelperText>
    </FormControl>
  );
});