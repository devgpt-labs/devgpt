import { Box, Flex, useToast, Text } from "@chakra-ui/react";
import MoonLoader from "react-spinners/MoonLoader";
import { useEffect, useState } from "react";
import Message from "./Message";

const Loading = () => {
  const [loadingFailed, setLoadingFailed] = useState(false);

  useEffect(() => {
    const loadingTimer = setTimeout(() => {
      setLoadingFailed(true);
    }, 5000);
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
          <MoonLoader
            color={"#ffffff"}
            loading={true}
            size={30}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        )}
      </Flex>
    </Message>
  );
};

export default Loading;
