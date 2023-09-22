"use client";
import React, { FC, useState } from "react";
import { Text, Center, Box, useToast, Fade } from "@chakra-ui/react";

export const ConversationStyleToggle = ({ visible }: any) => {
  const toast = useToast();

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
      <Box mt={4} minW="60" className="bg-slate-900 rounded-full p-1">
        <ul className="flex justify-between gap-1 text-sm items-stretch">
          <ToggleItem onClick={onClickHandler}>👎</ToggleItem>
          <ToggleItem onClick={onClickHandler}>👍</ToggleItem>
          <ToggleItem onClick={onClickHandler}>❤️</ToggleItem>
          <ToggleItem onClick={onClickHandler}>👀</ToggleItem>
          <ToggleItem onClick={onClickHandler}>🚀</ToggleItem>
        </ul>
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

  const handleItemClick = () => {
    if (props.onClick) props.onClick();
    setShowCheckmark(true);
    setTimeout(() => {
      setShowCheckmark(false);
    }, 2000);
  };

  return (
    <li
      onClick={handleItemClick}
      className={`border gap-2 border-transparent py-2 hover:bg-slate-800 cursor-pointer grow justify-center flex rounded-full flex-1 items-center`}
    >
      <Box>
        <Fade in={!showCheckmark}>
          <Text>{props.children}</Text>
        </Fade>
        <Fade in={showCheckmark}>
          <Text color="green.500">☑️</Text>
        </Fade>
      </Box>
    </li>
  );
};
