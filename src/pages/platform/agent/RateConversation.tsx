"use client";
import React, { FC, useState } from "react";
import {
  Text,
  Center,
  Box,
  useToast,
  ListItem,
  List,
  Flex,
  Fade,
  useColorMode,
} from "@chakra-ui/react";

const RateConversation = ({ visible }: any) => {
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
      <Flex
        minW="60"
        rounded="full"
        flexDirection="row"
        bg={colorMode === "light" ? "white" : "gray.800"}
      >
        <List
          display="flex"
          justifyContent="space-between"
          gap={1}
          fontSize="sm"
        >
          <ToggleItem onClick={onClickHandler}>👎</ToggleItem>
          <ToggleItem onClick={onClickHandler}>👍</ToggleItem>
          <ToggleItem onClick={onClickHandler}>❤️</ToggleItem>
          <ToggleItem onClick={onClickHandler}>👀</ToggleItem>
          <ToggleItem onClick={onClickHandler}>🚀</ToggleItem>
        </List>
      </Flex>
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
      alignItems="center"
      flex={1}
      rounded="full"
      display="flex"
      justifyContent="center"
      flexGrow={1}
      cursor="pointer"
      border="transparent"
    >
      <Box>
        {!showCheckmark && <Text>{props.children}</Text>}
        <Fade in={!showCheckmark}></Fade>
        {showCheckmark && <Text color="green.500">☑️</Text>}
      </Box>
    </ListItem>
  );
};

export default RateConversation;