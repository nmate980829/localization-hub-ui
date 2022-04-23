import * as React from "react";
import { FormControl, FormLabel, Switch, Tooltip, Text, Flex } from '@chakra-ui/react';
import { RightProps } from './types';

export const RightItem: React.FC<RightProps> = ({ item, selected, setSelected  }) => (
  <Tooltip label={item.description}>
    <Flex>
      <FormControl display='flex' alignItems='center' mb={1}>
        <Switch isChecked={selected} id={item.name} onChange={(val) => setSelected(val.target.checked)} />
        <FormLabel htmlFor={item.name} mb='0' ml={3} >
          <Text wordBreak="keep-all">{item.name}</Text>
        </FormLabel>
      </FormControl>
    </Flex>
  </Tooltip>
);
