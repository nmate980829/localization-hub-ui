import * as React from 'react';
import {FormControl, FormHelperText, FormLabel, Input, InputGroup, InputLeftElement, useColorModeValue} from '@chakra-ui/react';
import {EmailIcon} from '@chakra-ui/icons'
import { InputProps, NameProps } from './types';

export const NameField = React.forwardRef<HTMLInputElement, InputProps & NameProps>(({value, setValue, label, id, placeholder, className}, ref) => {
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  return (
    <FormControl id={id} pb={4}>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input type="text"
          placeholder={placeholder}
          _placeholder={{color: placeholderColor}}
          value={value}
          onChange={event => setValue(event.target.value)}
          ref={ref}
          className={className}
          />
      </InputGroup>
    </FormControl>
  );
});
