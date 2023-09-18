import { Flex, Text, Button } from "@chakra-ui/react";

interface HeaderProps {
  header: string;
  button: string;
  onOpen: any;
  buttonIcon: any;
}

const Header = ({ header, button, onOpen, buttonIcon }: HeaderProps) => {
  return (
    <Flex
      width="100%"
      p={8}
      ml={8}
      mr={8}
      justifyContent="space-between"
      direction={"row"}
      alignItems={"center"}
    >
      <Text fontSize={24}>{header}</Text>
      {button && (
        <Button fontSize={16} onClick={onOpen}
          bgGradient={"linear(to-r, blue.500, teal.500)"}
        >
          <Text mr={buttonIcon ? 3 : 0}>{button}</Text>
          {buttonIcon}
        </Button>
      )}
    </Flex>
  );
};

export default Header;
