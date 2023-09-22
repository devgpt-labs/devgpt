"use client";
import { Text, Button, Link, Tooltip } from "@chakra-ui/react";

const GitConnectorButton = ({
  color,
  provider,
  setLoading,
  loading,
  handle,
  Icon,
  tooltip,
}: any) => {
  return (
    <Tooltip placement="right" label={tooltip}>
      <Button
        bg={color}
        justifyContent="space-between"
        width="100%"
        onClick={() => {
          tooltip
            ? null
            : handle()
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
    </Tooltip>
  );
};

export default GitConnectorButton;
