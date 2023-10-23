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

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//utils
import { getPaginatedRepos } from "@/utils/github/getRepos";
import { supabase } from "@/utils/supabase";
import RepoSetupModal from "./RepoSetupModal";
import getModels from "@/utils/getModels";
import addTrainingLog from "@/utils/addTrainingLog";

//components
type PageInfo = {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
};

const RepoDrawer = ({ setRefresh, refresh }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isRepoSetupOpen,
    onOpen: onRepoSetupOpen,
    onClose: onRepoSetupClose,
  } = useDisclosure();

  const { repoWindowOpen, setRepo, setLofaf }: any = repoStore();
  const { session, user, signOut, stripe_customer_id }: any = authStore();

  const [repos, setRepos] = useState<any[]>([]);
  const [reposCount, setReposCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(false); //
  const [trainedModels, setTrainedModels] = useState<any[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<any>(null);
  const btnRef = useRef<any>();

  if (!user) {
    return null;
  }

  useEffect(() => {
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
    // Close the modal, no more user input required
    onClose();

    // Set repo to be the new repo
    setRepo({
      owner: repo.owner.login,
      repo: repo.name,
    });

    // Create a new row in the models table in Supabase
    if (!supabase) return;

    const newModel = {
      created_at: new Date().toISOString(),
      stripe_customer_id: stripe_customer_id,
      repo: repo.name,
      owner: repo.owner.login,
      branch: "main",
      epochs: repo.epochs,
      training_method: "ENCODING",
      frequency: repo.frequency,
      sample_size: repo.sampleSize,
      output: null,
      deleted: false,
      email_address: user?.email,
    };

    //insert the first training_log
    addTrainingLog(newModel);

    const { data, error } = await supabase
      .from("models")
      .insert([{ ...newModel }]);

    setRefresh(!refresh);

    if (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getModels(setTrainedModels, () => { }, user?.email);
  }, [repos]);

  if (!session?.provider_token) {
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
          <DrawerCloseButton mt={2} />
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
                    return !trainedModels.some((model) => model === repoOption);
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
              <Stack spacing={2}>
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
