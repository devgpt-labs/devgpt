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
import OpenAI from "openai";
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import messageStore from "@/store/Messages";

//utils
import getLLMToken from "@/utils/getLLMToken";
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

const openai = new OpenAI({
  apiKey: getLLMToken(),
  dangerouslyAllowBrowser: true,
});

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
  const { session, user, signOut }: any = authStore();
  const { setMessages }: any = messageStore();

  const [repos, setRepos] = useState<any[]>([]);
  const [reposCount, setReposCount] = useState<number>(0);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [filter, setFilter] = useState<string>("");
  const [loading, setLoading] = useState(false); // For the refresh debounce
  const [finetuningId, setFinetuningId] = useState<string>(""); // For the refresh debounce
  const btnRef = useRef<any>();

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

    // Set repo to be the new repo
    setRepo({
      owner: repo.owner.login,
      repo: repo.name,
    });

    // Get Lofaf
    const lofaf = await getLofaf(repo.owner.login, repo.name, session);
    const epochs = 3;
    const training_cycles = 2

    // Manipulate lofaf
    let lofafArray = lofaf.tree;
    lofafArray = lofafArray.map((item: any) => {
      return item.path;
    });

    // Join the lofaf together
    const lofafString = lofafArray.join(",");

    // Set Lofaf
    setLofaf(lofafArray);

    // Create training data
    let trainingData = await createTrainingData(
      training_cycles,
      lofafString,
      {
        owner: repo.owner.login,
        repo: repo.name,
      },
      user,
      session
    );

    console.log({ trainingData });


    //set training data in store
    setMessages(trainingData);

    if (process.env.NEXT_PUBLIC_FINE_TUNE_MODE === "true") {
      // Convert the content to JSONL format
      const jsonlContent = trainingData.map(JSON.stringify).join("\n");

      // Convert to a blob
      const blob = new Blob([jsonlContent], { type: "text/plain" });

      // Convert to a file
      const file = new File([blob], "training.jsonl");

      // Upload the file to openai API
      const uploadedFiles = await openai.files.create({
        file,
        purpose: "fine-tune",
      });

      // Create a fine-tuning job from the uploaded file
      const finetune = await openai.fineTuning.jobs.create({
        training_file: uploadedFiles.id,
        model: `gpt-3.5-turbo`,
        hyperparameters: { n_epochs: 3 },
      });

      // Create a new row in the models table in Supabase
      if (!supabase) return;

      const { data, error } = await supabase.from("models").insert([
        {
          user_id: user.id,
          repo: repo.name,
          owner: repo.owner.login,
          branch: "main",
          training_data: "ft:model_id",
          // training_data: finetune.id,
          training_method: "fine-tune",
          quantity: training_cycles,
          epochs: epochs,
        },
      ]);

      if (error) {
        console.log(error);
      }

      // Set the fine-tuning ID
      setFinetuningId(finetune.id);
    }
  };

  // const checkProgressOfFineTuning = async () => {
  //   const job = await openai.fineTuning.jobs.retrieve(finetuningId);

  //   console.log("Job Status:", job.status);

  //   if (job.status === "succeeded") {
  //     console.log("Fine-tuning has completed successfully.");
  //     console.log("Fine-tuned model ID:", job.fine_tuned_model);
  //   } else if (job.status === "failed") {
  //     console.log(
  //       "Fine-tuning has failed. Check the error message:",
  //       job.error
  //     );
  //   } else {
  //     console.log("Fine-tuning is still in progress.");
  //   }
  // };

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
                    {/* <Button
                      size="sm"
                      onClick={checkProgressOfFineTuning}
                      isLoading={loading}
                      disabled={loading}
                    >
                      Check Progress
                    </Button> */}
                  </InputRightElement>
                </InputGroup>

                {repos
                  .filter((repoOption) => {
                    return repoOption.name
                      .toLowerCase()
                      .includes(filter.toLowerCase());
                  })
                  ?.map((repoOption) => {
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
                            {repoOption.name?.length > 16 && "..."}
                          </Text>

                          <Text fontSize={12} color="gray">
                            {repoOption.owner.login}
                          </Text>
                        </Flex>

                        <Button
                          size="sm"
                          onClick={() => {
                            // handleSelectRepo(repoOption)
                            setSelectedRepo(repoOption);
                            onRepoSetupOpen();
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
