import { Box, Flex } from "@chakra-ui/react";
import MoonLoader from "react-spinners/MoonLoader";

import Message from "./Message";

const Loading = () => {
  return (
    <Message>
      <Flex flex={1}>
        <MoonLoader
          color={"#ffffff"}
          loading={true}
          size={30}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </Flex>
    </Message>
  );
};

export default Loading;
