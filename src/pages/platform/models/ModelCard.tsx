"use client";
import { useState } from "react";
import {
  Flex,
  Text,
  Box,
  Heading,
  CardBody,
  Card,
  Grid,
  GridItem,
  Badge,
  StackDivider,
  Stack,
  Stat,
  StatLabel,
  StatNumber,
  IconButton,
  useDisclosure,
  Button,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import ConfirmationModal from "./ConfirmationModal";
import Cookies from "js-cookie";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";
import { supabase } from "@/utils/supabase";

//components
import ModelInTraining from "@/pages/platform/models/ModelInTraining";
import Setup from "@/components/repos/Setup";

//utils
import moment from "moment";

//icons
import { DeleteIcon } from "@chakra-ui/icons";
import { AiFillEdit } from "react-icons/ai";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiCircleLight } from "react-icons/pi";
import { MdRefresh } from "react-icons/md";
import handleChargeCustomer from "@/utils/handleChargeCustomer";
import trainModel from "@/utils/trainModel";
import { useRouter } from "next/router";
import { FaBrain } from "react-icons/fa";

const ModelCard = ({
  model,
  modelsInTraining,
  setModelsInTraining,
  id,
}: {
  model: any;
  modelsInTraining: any;
  setModelsInTraining: any;
  id: any;
}) => {
  const { session, user, isPro }: any = authStore();
  const { repo, setRepo }: any = repoStore();
  const router = useRouter();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isTrainOpen,
    onOpen: onTrainOpen,
    onClose: onTrainClose,
  } = useDisclosure();
  const [deletingModel, setDeletingModel] = useState<boolean>(false);
  const [savedChanges, setSavedChanges] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const handleTrainModel = async () => {
    setIsTraining(true);
    setIsErrored(false);

    // Set this model to actively train
    const trainingOutput: any = await trainModel(model, session, user);

    //validate the output
    if (trainingOutput?.length) {
      handleModelInTrainingChange({
        target: {
          name: "output",
          value: JSON.stringify(trainingOutput),
        },
      });

      setIsErrored(false);
      setIsTraining(false);
    } else {
      setIsErrored(true);
      setIsTraining(false);
    }
  };

  const updateModel = async () => {
    if (!supabase) {
      console.log("Supabase is not initialized.");
      return;
    }

    if (!model || !id) {
      console.log("Model is missing required properties.");
      return;
    }

    const { data, error } = await supabase
      .from("models")
      .update({
        frequency: model.frequency,
        sample_size: model.sample_size,
        epochs: model.epochs,
      })
      .eq("id", id)
      .select();

    if (error) {
      console.log("Error updating the model:", error);
    } else {
      console.log("Model updated successfully.");
    }
  };

  const deleteModel = async () => {
    if (!supabase) {
      console.log("Supabase is not initialized.");
      return;
    }

    if (!model || !id) {
      console.log("Model is missing required properties.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("models")
        .update({
          deleted: "TRUE",
        })
        .eq("id", id)
        .select();

      if (error) {
        console.log("Error deleting the model:", error);
      } else {
        console.log("Model deleted successfully.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const saveKeyInCookies = async (repoData: any) => {
    const cookieName = "recentlyUsedRepoKey";
    Cookies.set(cookieName, JSON.stringify(repoData), { expires: 14 });
  };

  const handleModelInTrainingChange = (e: any) => {
    const { name, value } = e.target;

    setModelsInTraining(
      modelsInTraining.map((m: any) => {
        if (m.id === id) {
          return {
            ...m,
            [name]: value,
          };
        }

        return m;
      })
    );
  };

  if (!model) return null;

  return (
    <Box>
      <ConfirmationModal
        header="Delete this model?"
        body="Confirm you would like to delete this DevGPT model. This is a
              permanent action but you can always re-add a new model for the
              same repository later on."
        confirmButtonText="Delete"
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onSubmit={() => {
          deleteModel();
          handleModelInTrainingChange({
            target: {
              name: "deleted",
              value: true,
            },
          });
        }}
      />
      <ConfirmationModal
        header="Train this model?"
        body="Confirm you would like to Train this model, you will not be charged if your model has failed to train."
        confirmButtonText="Train"
        isOpen={isTrainOpen}
        onClose={onTrainClose}
        onSubmit={() => {
          handleTrainModel();
        }}
      />
      <Card
        onClick={() => {
          saveKeyInCookies({
            owner: model.owner,
            repo: model.repo,
          });

          setRepo({
            owner: model.owner,
            repo: model.repo,
          });
        }}
        cursor="pointer"
        rounded="lg"
        flexDirection="row"
        bg="whiteAlpha.300"
        boxShadow="lg"
        opacity={repo.repo === model.repo ? "1" : "0.6"}
        transition="opacity 0.2s ease-in-out"
        _hover={{ opacity: "1" }}
      >
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Flex justifyContent={"space-between"}>
                <Heading size="md" mb={2}>
                  {model.repo}
                </Heading>
                <Flex flexDirection={"row"} gap={2}>
                  <Tooltip label="Delete Model">
                    <IconButton
                      size="sm"
                      onClick={() => {
                        onDeleteOpen();
                        setDeletingModel(model.repo);
                      }}
                      aria-label="Delete Model"
                      icon={
                        deletingModel === model.repo ? (
                          <Spinner size="sm" />
                        ) : (
                          <DeleteIcon />
                        )
                      }
                    />
                  </Tooltip>
                  {/* <Tooltip label="Edit Model">
                    <IconButton
                      size="sm"
                      onClick={() => setShow(!show)}
                      aria-label="Edit Model"
                      icon={<AiFillEdit />}
                    />
                  </Tooltip>
                  <Tooltip label="Train Model">
                    <IconButton
                      isDisabled={isTraining}
                      size="sm"
                      onClick={() => {
                        onTrainOpen();
                        setRepo({
                          owner: model.owner,
                          repo: model.repo,
                        });
                      }}
                      aria-label="Train Model"
                      icon={isTraining ? <Spinner size="sm" /> : <FaBrain />}
                    />
                  </Tooltip> */}
                  <Tooltip label="Select Model">
                    <IconButton
                      size="sm"
                      onClick={() => {
                        // Save this in cookies, and replace it each time it's clicked using js-cookie
                        saveKeyInCookies({
                          owner: model.owner,
                          repo: model.repo,
                        });

                        setRepo({
                          owner: model.owner,
                          repo: model.repo,
                        });

                        router.push("/platform/agent", undefined, {
                          shallow: true,
                        });
                      }}
                      aria-label="Select Model"
                      icon={
                        repo.repo === model.repo ? (
                          <AiFillCheckCircle />
                        ) : (
                          <PiCircleLight />
                        )
                      }
                    />
                  </Tooltip>
                </Flex>
              </Flex>
              <Flex flexDirection="column" gap={1} mb={1}>
                <Badge
                  colorScheme={
                    model.deleted
                      ? "red"
                      : isTraining
                        ? "blue"
                        : isErrored
                          ? "orange"
                          : !JSON.parse(model.output) ||
                            JSON.parse(model.output)?.length < 2
                            ? "orange"
                            : "teal"
                  }
                  alignSelf="flex-start"
                >
                  Status:{" "}
                  In Use
                </Badge>
                {isErrored && (
                  <Text fontSize={14}>
                    We're sorry this model has failed training. LLM's can be
                    tempermental, please try again. You will not be charged.
                  </Text>
                )}
                {isTraining && (
                  <Text fontSize={14}>
                    During training, avoid leaving the models page as this may
                    cause the training to fail.
                  </Text>
                )}
              </Flex>
              <Text fontSize={14}>
                {model.owner} / {model.repo} / {model.branch}
              </Text>
              <Text fontSize={14}>
                {moment(model.created_at).format("MMMM Do YYYY, h:mm:ss a")}
              </Text>
            </Box>
            {/* <Box>
              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                <GridItem>
                  <Stat>
                    <StatLabel>Frequency</StatLabel>
                    <StatNumber>{model.frequency}</StatNumber>
                    <Text fontSize={10}>Train X times a month</Text>
                  </Stat>
                </GridItem>
                <GridItem>
                  <Stat>
                    <StatLabel>Sample Size</StatLabel>
                    <StatNumber>{model.sample_size}</StatNumber>
                    <Text fontSize={10}>Train on X amount of files</Text>
                  </Stat>
                </GridItem>
              </Grid>
            </Box> */}
          </Stack>
          <Box mt={5}>{isTraining && <ModelInTraining model={model} />}</Box>
          {show && (
            <Flex flexDirection="column" mt={4}>
              <Setup
                repo={model}
                trainingMethod={model.training_method}
                sampleSize={model.sample_size}
                frequency={model.frequency}
                branch={model.branch}
                epochs={model.epochs}
                setSampleSize={(e: any) => {
                  handleModelInTrainingChange({
                    target: {
                      name: "sample_size",
                      value: e,
                    },
                  });
                }}
                setFrequency={(e: any) => {
                  handleModelInTrainingChange({
                    target: {
                      name: "frequency",
                      value: e,
                    },
                  });
                }}
                setEpochs={(e: any) => {
                  handleModelInTrainingChange({
                    target: {
                      name: "epochs",
                      value: e,
                    },
                  });
                }}
              // setBranch={(e: any) => {
              //   handleModelInTrainingChange({
              //     target: {
              //       name: "branch",
              //       value: e,
              //     },
              //   });
              // }}
              />
              <Flex gap={2} mt={4}>
                <Button onClick={() => setShow(false)}>Cancel</Button>
                <Button
                  width="100%"
                  bgGradient="linear(to-r, blue.500,teal.500)"
                  color="white"
                  onClick={() => {
                    updateModel();
                    setSavedChanges(true);
                  }}
                >
                  {savedChanges ? "Saved!" : "Save"}
                </Button>
              </Flex>
            </Flex>
          )}
        </CardBody>
      </Card>
    </Box >
  );
};

export default ModelCard;
