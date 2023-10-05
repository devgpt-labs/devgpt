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
import getModels from "@/utils/getModels";

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
  const [finetuningId, setFinetuningId] = useState<string>(""); //
  const [loading, setLoading] = useState(false); //
  const btnRef = useRef<any>();
  const [trainedModels, setTrainedModels] = useState<any[]>([]); //
  const [selectedRepo, setSelectedRepo] = useState<any>(null);

  useEffect(() => {
    console.log({ repoWindowOpen });
    if (repoWindowOpen === null || !repoWindowOpen) return;
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
    console.log({ repo });

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

    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getModels(setTrainedModels, () => {}, stripe_customer_id);
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
              Train A New Model {reposCount ? ` (${reposCount} repos) ` : ""}
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
                            setSelectedRepo(repoOption);
                            onRepoSetupOpen();
                          }}
                        >
                          Train
                        </Button>
                      </Flex>
                    );
                  })}
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
