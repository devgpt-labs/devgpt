"use client";
import React, { FC, useState } from "react";
import { Text, Center, Box, useToast, Button, ListItem, List, useColorMode } from "@chakra-ui/react";

export const ConversationStyleToggle = ({ visible }: any) => {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const onClickHandler = () => {
    toast({
      title: "Thank you!",
      description: "Thank you for your feedback.",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
  };

  if (visible === false) return null;

  return (
    <Center>
      <Box mt={4} minW="60" className="rounded-full p-1" bg={colorMode === 'light' ? 'white' : 'gray.800'}>
        <List className="flex justify-between gap-1 text-sm items-stretch">
          <ToggleItem onClick={onClickHandler}>👎</ToggleItem>
          <ToggleItem onClick={onClickHandler}>👍</ToggleItem>
          <ToggleItem onClick={onClickHandler}>❤️</ToggleItem>
          <ToggleItem onClick={onClickHandler}>👀</ToggleItem>
          <ToggleItem onClick={onClickHandler}>🚀</ToggleItem>
        </List>
      </Box>
    </Center>
  );
};

interface ToggleItemProps {
  children?: React.ReactNode;
  onClick?: () => void;
}

const ToggleItem: FC<ToggleItemProps> = (props) => {
  const { colorMode } = useColorMode();

  return (
    <ListItem
      onClick={props.onClick}
      gap={2}
      py={2}
      px={4}
      _hover={{
        bg: colorMode === 'light' ? 'gray.100' : 'black'
      }}
      className={`border border-transparent cursor-pointer grow justify-center flex rounded-full flex-1 items-center`}
    >
      <Box>
        <Text>{props.children}</Text>
      </Box>
    </ListItem>
  );
};
