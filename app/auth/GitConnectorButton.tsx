"use client";
import { Text, Button, Link, Tooltip, useColorMode } from "@chakra-ui/react";


const GitConnectorButton = ({
  color,
  provider,
  setLoading,
  loading,
  handle,
  Icon,
  tooltip,
}: any) => {
  const { colorMode } = useColorMode();
  return (
    <Tooltip placement="right" label={tooltip}>
      <Button
        isDisabled={tooltip ? true : false}
        bg={colorMode === 'light' ? 'white' : color}
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
