import React from "react";
import { useSessionContext } from "@/context/useSessionContext";
import Auth from "./auth/auth";
import Chat from "./chat/chat";
import RepoDrawer from "./repos/RepoDrawer";
import { useDisclosure } from "@chakra-ui/react";

const Home = () => {
  const { user } = useSessionContext();

  return (
    <>
      {user ? <Chat /> : <Auth />}
      <RepoDrawer />
    </>
  );
};

export default Home;
