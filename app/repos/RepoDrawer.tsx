import React, { useState, useRef, useEffect } from "react";
import {
  Drawer,
  Input,
  DrawerBody,
  DrawerHeader,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
  DrawerFooter,
  Text,
  Button,
  Flex,
  useDisclosure,
} from "@chakra-ui/react";
import { useSessionContext } from "@/context/useSessionContext";
import getRepos from "@/utils/github/getRepos";

//components
import Loader from "@/app/components/Loader";

const RepoDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: false,
  });
  const { repo, methods, session, user, repoWindowOpen } = useSessionContext();
  const [repos, setRepos] = useState<any[]>([]);
  const btnRef = useRef<any>();

  useEffect(() => {
    if (repoWindowOpen === null) return;
    onOpen();
  }, [repoWindowOpen]);

  useEffect(() => {
    getRepos(session?.provider_token)
      .then((allRepos) => {
        setRepos(allRepos);
      })
      .catch((err) => {
        console.log({ err });
      });
  }, [user]);

  if (!user) {
    return null;
  }

  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Select a repo</DrawerHeader>
          <DrawerBody>
            {repos?.length > 0 ? (
              repos?.map((repoOption, index) => {
                return (
                  <Flex
                    key={repoOption.name + repoOption.owner.login}
                    my={2}
                    flexDirection="row"
                    justifyContent={"space-between"}
                    alignItems={"center"}
                  >
                    <Flex flexDirection="column">
                      <Text fontSize={16}>
                        {repoOption.name.substring(0, 16)}
                        {repoOption.name.length > 16 && "..."}
                      </Text>

                      <Text fontSize={12} color="gray">
                        {repoOption.owner.login}
                      </Text>
                    </Flex>

                    <Button
                      size="sm"
                      onClick={() => {
                        onClose();
                        methods.setRepo({
                          owner: repoOption.owner.login,
                          repo: repoOption.name,
                        });
                      }}
                    >
                      {repo.repo === repoOption.name &&
                      repo.owner === repoOption.owner.login
                        ? "Selected"
                        : "Select"}
                    </Button>
                  </Flex>
                );
              })
            ) : (
              <Loader />
            )}
          </DrawerBody>
          <DrawerFooter />
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default RepoDrawer;
