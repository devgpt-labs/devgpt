import React, { useState } from "react";
import { useSessionContext } from "@/context/useSessionContext";
import Auth from "./auth/Auth";
import Chat from "./chat/Chat";
import RepoDrawer from "./repos/RepoDrawer";
import { Tag, Text, Flex, useColorMode } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const Home = () => {
  const { user, session } = useSessionContext();
  const { colorMode } = useColorMode();
  const [closed, setClosed] = useState<boolean>(false);

  return (
    <Flex
      flexDirection="column"
      bg={colorMode === "dark" ? "black" : "whitesmoke"}
      width="100vw"
      height="100vh"
      overflowY="scroll"
    >
      {!closed && (
        <Tag
          p={2}
          py={3}
          colorScheme="blue"
          alignItems="center"
          justifyContent="center"
          width="100vw"
          flexDirection="row"
          gap={3}
        >
          <Text>
            DevGPT is now accessible via the web! 🎉 Improved desktop app coming
            soon.
          </Text>
          <CloseIcon
            cursor="pointer"
            alignSelf="flex-end"
            ml={10}
            width="12px"
            height="12px"
            onClick={() => {
              setClosed(true);
            }}
          />
        </Tag>
      )}
      <Flex
        height="95vh"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {user && session ? (
          <>
            <Chat />
            <RepoDrawer />
          </>
        ) : (
          <>
            <Auth />
          </>
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
