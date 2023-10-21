"use client";
import { Text, Button, Link, useColorMode } from "@chakra-ui/react";

const AuthOption = ({ label, Icon, url }: any) => {
  const { colorMode } = useColorMode();
  return (
    <Link width="100%" href={url}>
      <Button width="100%" justifyContent="space-between" bg={colorMode === 'light' ? "white" : 'gray.800'}>
        <Text fontWeight={"normal"} mr={2}>
          {label}
        </Text>
        {Icon && Icon}
      </Button>
    </Link>
  );
};

export default AuthOption