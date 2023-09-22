"use client";
import { Text, Button, Link, Tooltip } from "@chakra-ui/react";

const GitConnectorButton = ({
  color,
  provider,
  setLoading,
  loading,
  handle,
  Icon,
}: any) => {
  return (
    <Button
      bg={color}
      justifyContent="space-between"
      width="100%"
      onClick={() => {
        handle()
          .then(() => {
            setLoading(true);
          })
          .catch(() => {
            setLoading(false);
          });
      }}
    >
      {`${provider}`}
      <Icon />
    </Button>
  );
};

export default GitConnectorButton;
