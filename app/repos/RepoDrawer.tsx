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
  Skeleton,
  Stack,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useSessionContext } from "@/context/useSessionContext";
import { mockManager } from "@/app/configs/mockManager";
import { getPaginatedRepos } from "@/utils/github/getRepos";
import { supabase } from "@/utils/supabase";
// import getRepos from "@/utils/bitbucket/getRepos";

//components
type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

const RepoDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure({
    defaultIsOpen: false,
  });
  const { repo, methods, session, user, repoWindowOpen } = useSessionContext();
  const [repos, setRepos] = useState<any[]>([]);
  const [reposCount, setReposCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(false); // For the refresh debounce
  const btnRef = useRef<any>();

  useEffect(() => {
    if (repoWindowOpen === null) return;
    onOpen();
  }, [repoWindowOpen, onOpen]);

  const handleRefresh = () => {
    setLoading(true);
    fetchRepos();

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  useEffect(() => {


    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const fetchRepos = () => {
    if (mockManager.isMockIntegrationsEnabled()) {
      setRepos(mockManager.mockRepos());
      return;
    }

    if (!session) return;
    if (repos.length > 0) return;
    if (!session?.provider_token) return;

    // getRepos for bitbucket
    // getRepos(session.provider_token).then((allRepos: any) => {
    //   setRepos(allRepos);
    //   console.log({ allRepos });
    // });

    getPaginatedRepos(session?.provider_token)
      .then((allRepos: any) => {
        if (allRepos?.nodes?.length) {
          setRepos(allRepos.nodes);
          setReposCount(allRepos.totalCount);
          setPageInfo(allRepos.pageInfo);
        }
      })
      .catch((err: any) => {
        console.log("Failed to get repos:", { err });
      });
  };

  useEffect(() => {
    fetchRepos();
  }, [user]);

  const onPreviousPage = async () =>
    session?.provider_token &&
    getPaginatedRepos(session?.provider_token, pageInfo?.endCursor)
      .then((allRepos: any) => {
        if (allRepos?.nodes?.length) {
          setRepos(allRepos.nodes);
          setPageInfo(allRepos.pageInfo);
        }
      })
      .catch((err) => {
        console.log("Failed to get repos:", { err });
      });

  const onNextPage = async () =>
    session?.provider_token &&
    getPaginatedRepos(session?.provider_token, null, pageInfo?.endCursor)
      .then((allRepos: any) => {
        if (allRepos?.nodes?.length) {
          setRepos(allRepos.nodes);
          setPageInfo(allRepos.pageInfo);
        }
      })
      .catch((err: any) => {
        console.log("Failed to get repos:", { err });
      });

  if (!user) {
    return null;
  }

  const signUserOut = async () => {
    await supabase?.auth.signOut();
  };

  if (!session.provider_token) {
    console.log("logging out");

    if (!supabase) return;
    signUserOut();
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
          <DrawerHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>Select a repo{reposCount ? ` (${reposCount})` : ""}</Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            {repos?.length > 0 ? (
              <>
                <InputGroup>
                  <Input
                    pr="4.5rem"
                    className="mb-2"
                    placeholder="Search repos"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                  />
                  <InputRightElement width="4.5rem" mr={1}>
                    <Button
                      size="sm"
                      onClick={handleRefresh}
                      isLoading={loading}
                      disabled={loading}
                    >
                      Refresh
                    </Button>
                  </InputRightElement>
                </InputGroup>

                {repos
                  .filter((repoOption: any) => {
                    return repoOption.name
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  })
                  ?.map((repoOption: any) => {
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
                  })}
              </>
            ) : (
              <Stack mt={4} spacing={2}>
                <Text fontSize={14} mb={2}>
                  Taking too long to load? Try logging out and logging back in.
                </Text>
                <Skeleton height="40px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
                <Skeleton height="30px" />
              </Stack>
            )}
          </DrawerBody>
          {(pageInfo?.hasPreviousPage || pageInfo?.hasNextPage) && (
            <DrawerFooter className="gap-2">
              <>
                {pageInfo.hasPreviousPage && (
                  <Button size="sm" variant="outline" onClick={onPreviousPage}>
                    Previous
                  </Button>
                )}
                {pageInfo.hasNextPage && (
                  <Button size="sm" variant="outline" onClick={onNextPage}>
                    Next
                  </Button>
                )}
              </>
            </DrawerFooter>
          )}
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default RepoDrawer;
