"use client";
import { Text, Button, Link, Tooltip } from "@chakra-ui/react";

const AuthOption = ({ label, Icon, url }: any) => {
  return (
    <Link width="100%" isExternal href={url}>
      <Button width="100%" justifyContent="space-between">
        <Text fontWeight={"normal"} mr={2}>
          {label}
        </Text>
        <Icon />
      </Button>
    </Link>
  );
};

export default AuthOption;
