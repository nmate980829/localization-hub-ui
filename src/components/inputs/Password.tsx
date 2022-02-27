import * as React from 'react';
import {Button, FormControl, FormHelperText, FormLabel, Input, InputGroup, InputLeftElement, InputRightElement, useColorModeValue} from '@chakra-ui/react';
import {LockIcon, ViewIcon, ViewOffIcon} from '@chakra-ui/icons'
import { InputProps } from './types';

export const PasswordField: React.FC<InputProps> = ({value, setValue}) => {
  const placeholderColor = useColorModeValue('gray.500', 'gray.400');
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)

  return (
    <FormControl id="password" pb={4}>
      <FormLabel>Password</FormLabel>
      <InputGroup size="md">
        <InputLeftElement
          pointerEvents="none"
          children={<LockIcon />}
        />
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          placeholder="Enter password"
          _placeholder={{color: placeholderColor}}
          value={value}
          onChange={event => setValue(event.target.value)}
        />
        <InputRightElement width="3.0rem">
          <Button h="1.75rem" size="sm" onClick={handleClick} variant="unstyled">
            {show ? (
              <ViewOffIcon />
            ) : (
              <ViewIcon />
            )}
          </Button>
        </InputRightElement>
      </InputGroup>
      <FormHelperText>Please enter a password, at least 6 characters long.</FormHelperText>
    </FormControl>
    
  )
}