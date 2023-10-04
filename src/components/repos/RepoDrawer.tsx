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
  CardHeader,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
} from "@chakra-ui/react";

//stores

import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";

//utils

import { getPaginatedRepos } from "@/utils/github/getRepos";
import createTrainingData from "@/utils/createTrainingData";
import getLofaf from "@/utils/github/getLofaf";
import { supabase } from "@/utils/supabase";
import RepoSetupModal from "./RepoSetupModal";

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
  const {
    isOpen: isRepoSetupOpen,
    onOpen: onRepoSetupOpen,
    onClose: onRepoSetupClose,
  } = useDisclosure();

  const { repo, repoWindowOpen, setRepo, setLofaf }: any = repoStore();
  const { session, user, signOut, stripe_customer_id }: any = authStore();
  const { setMessages }: any = messageStore();

  const [repos, setRepos] = useState<any[]>([]);
  const [reposCount, setReposCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(false); // For the refresh debounce
  const [finetuningId, setFinetuningId] = useState<string>(""); // For the refresh debounce
  const btnRef = useRef<any>();
  const [trainedModels, setTrainedModels] = useState<any[]>([]); // For the refresh debounce
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  useEffect(() => {
    if (repoWindowOpen === null) return;
    onOpen();
  }, [repoWindowOpen]);

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
    if (!session) return;
    if (repos.length > 0) return;
    if (!session?.provider_token) return;

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
  }, []);

  useEffect(() => {
    if (repos.length != 0) return;
    fetchRepos();
  }, [session]);

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

  const onNextPage = async () => {
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
  };

  const handleSelectRepo = async (repo: any) => {
    // Close the modal, no more user input required
    onClose();

    const name = repo.name;
    const owner = repo.owner.login;

    // Set repo to be the new repo
    setRepo({
      owner: owner,
      repo: name,
    });

    // Create a new row in the models table in Supabase
    if (!supabase) return;

    const { data, error } = await supabase.from("models").insert([
      {
        stripe_customer_id: stripe_customer_id,
        repo: name,
        owner: owner,
        branch: "main",
        epochs: 1,
        output: null,
        training_method: "ENCODING",
        frequency: 1,
        sample_size: 5,
      },
    ]);
  };

  // Get all models from supabase
  const getModels = async () => {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("models")
      .select("*")
      .eq("user_id", user?.id);

    if (!error) {
      setTrainedModels(data);
      // Find any repos that are in the models table,
    }
  };

  useEffect(() => {
    getModels();
  }, [repos]);

  if (!user) {
    return null;
  }

  if (!session.provider_token) {
    signOut();
  }

  return (
    <>
      <RepoSetupModal
        repo={selectedRepo}
        isOpen={isRepoSetupOpen}
        onClose={onRepoSetupClose}
        onOpen={onRepoSetupOpen}
        onSubmit={handleSelectRepo}
      />
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size={"sm"}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Flex justifyContent="space-between" alignItems="center">
              <Text>Select a repo</Text>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            {repos?.length > 0 ? (
              <>
                <InputGroup>
                  <Input
                    pr="4rem"
                    mb={2}
                    placeholder="Search repos"
                    value={filter}
                    onChange={(e) => {
                      setFilter(e.target.value);
                    }}
                  />
                  <InputRightElement width="4rem" mr={1}>
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

                <Accordion defaultIndex={[1]} allowMultiple>
                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Trained Models{" "}
                          {trainedModels.length
                            ? ` (${trainedModels.length})`
                            : ""}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {trainedModels
                        .filter((model) => {
                          return model.repo
                            .toLowerCase()
                            .includes(filter.toLowerCase());
                        })
                        .map((model) => {
                          return (
                            <Flex
                              key={model.repo + model.owner}
                              mb={2}
                              flexDirection="row"
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              <Flex flexDirection="column">
                                <Text fontSize={16}>
                                  {model.repo.substring(0, 16)}
                                  {model.repo?.length > 16 && "..."}
                                </Text>

                                <Text fontSize={12} color="gray">
                                  {model.owner}
                                </Text>
                              </Flex>

                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedRepo(model);
                                  onRepoSetupOpen();
                                }}
                              >
                                Select
                              </Button>
                            </Flex>
                          );
                        })}
                    </AccordionPanel>
                  </AccordionItem>

                  <AccordionItem>
                    <h2>
                      <AccordionButton>
                        <Box as="span" flex="1" textAlign="left">
                          Train A New Model{" "}
                          {reposCount ? ` (${reposCount})` : ""}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      {repos
                        .filter((repoOption) => {
                          return repoOption.name
                            .toLowerCase()
                            .includes(filter.toLowerCase());
                        })
                        .filter((repoOption) => {
                          // Remove any that are found on the models table
                          return !trainedModels.some(
                            (model) =>
                              model.repo === repoOption.name &&
                              model.owner === repoOption.owner.login
                          );
                        })
                        ?.map((repoOption) => {
                          return (
                            <Flex
                              key={repoOption.name + repoOption.owner.login}
                              mb={2}
                              flexDirection="row"
                              justifyContent={"space-between"}
                              alignItems={"center"}
                            >
                              <Flex flexDirection="column">
                                <Text fontSize={16}>
                                  {repoOption.name.substring(0, 16)}
                                  {repoOption.name?.length > 16 && "..."}
                                </Text>

                                <Text fontSize={12} color="gray">
                                  {repoOption.owner.login}
                                </Text>
                              </Flex>

                              <Button
                                size="sm"
                                onClick={() => {
                                  handleSelectRepo(repoOption);
                                  setSelectedRepo(repoOption);
                                  onRepoSetupOpen();
                                }}
                              >
                                Train
                              </Button>
                            </Flex>
                          );
                        })}
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <Stack mt={4} spacing={2}>
                <Text fontSize={14} mb={2}>
                  Is this taking too long? Try logging out and logging back in.
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
            <DrawerFooter gap={2}>
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
