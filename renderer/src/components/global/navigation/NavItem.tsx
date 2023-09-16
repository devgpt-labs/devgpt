import { useState } from "react";
import { FlexProps } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { Box, Flex, Text, Icon } from "@chakra-ui/react";

interface NavItemProps extends FlexProps {
  secondIcon?: React.ReactNode;
  iconColor?: string;
  icon?: IconType;
  children?: React.ReactNode;
  hoverText?: string;
  upgradeButton?: boolean;
}

const NavItem = ({
  icon,
  children,
  secondIcon,
  iconColor,
  hoverText,
  upgradeButton,
  ...rest
}: NavItemProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: "none" }}
      _focus={{ boxShadow: "none" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Flex
        maxW={80}
        align="center"
        p="4"
        borderRadius="3"
        role="group"
        cursor="pointer"
        bgGradient={upgradeButton ? "linear(to-r, blue.500, teal.500)" : null}
        _hover={
          upgradeButton
            ? { bgGradient: "linear(to-r, blue.400, teal.400)" }
            : { bg: "gray.800", color: "white" }
        }
        {...rest}
      >
        {isHovered && secondIcon}
        {icon && (
          <Box mr={4}>
            <Icon fontSize="sm" color={iconColor || "white"} as={icon} />
          </Box>
        )}
        <Text
          fontWeight={upgradeButton ? "bold" : "medium"}
          fontSize={14}
          maxW='75%'
          overflowWrap="anywhere"
        >
          {hoverText && isHovered ? hoverText : children}
        </Text>
      </Flex>
    </Box>
  );
};

export default NavItem;
