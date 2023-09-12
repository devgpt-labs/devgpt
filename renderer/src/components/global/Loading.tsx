import { Box, Flex, Text, Progress } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Message from "./Message";

const Loading = () => {
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoadingFailed(true);
    }, 300000);
    return () => clearTimeout(loadingTimer);
  }, []);

  return (
    <Message>
      <Flex flex={1}>
        {loadingFailed ? (
          <Text>
            I think something went wrong... please try again later or let us
            know in Discord.
          </Text>
        ) : (
          <Box width={"100%"}>
            <Progress borderRadius={"lg"} isIndeterminate hasStripe />
          </Box>
        )}
      </Flex>
    </Message>
  );
};

export default Loading;
