"use client";
import React, { FC, useState } from "react";
import {
  Text,
  Center,
  Box,
  useToast,
  ListItem,
  List,
  Fade,
  useColorMode,
} from "@chakra-ui/react";

export const RateConversation = () => {
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

  return (
    <Center>
      <Box
        minW="60"
        className="rounded-full"
        bg={colorMode === "light" ? "white" : "gray.800"}
      >
        <List className="flex justify-between gap-1 text-sm">
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
  const [showCheckmark, setShowCheckmark] = useState(false);
  const { colorMode } = useColorMode();

  const handleItemClick = () => {
    if (props.onClick) props.onClick();
    setShowCheckmark(true);
    setTimeout(() => {
      setShowCheckmark(false);
    }, 2000);
  };

  return (
    <ListItem
      onClick={handleItemClick}
      gap={2}
      py={2}
      px={4}
      _hover={{
        bg: colorMode === "light" ? "gray.300" : "black",
      }}
      className={`border border-transparent cursor-pointer grow justify-center flex rounded-full flex-1 items-center`}
    >
      <Box>
        {!showCheckmark && <Text>{props.children}</Text>}
        <Fade in={!showCheckmark}></Fade>
        {showCheckmark && <Text color="green.500">☑️</Text>}
      </Box>
    </ListItem>
  );
};
