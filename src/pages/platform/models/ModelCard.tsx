"use client";
import { useEffect, useState } from "react";
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
  useColorMode,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
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
import setFulfilledBackToFalseForTrainingLog from "@/utils/setFulfilledBackToFalseForTrainingLog";

//utils
import moment from "moment";

//icons
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiCircleLight } from "react-icons/pi";
import { BiRefresh } from "react-icons/bi";
import { MdRefresh } from "react-icons/md";
import addTrainingLog from "@/utils/addTrainingLog";
import createModelID from "@/utils/createModelID";
import trainModel from "@/utils/trainModel";

const ModelCard = ({
  trainingLogs,
  model,
  modelsInTraining,
  setModelsInTraining,
}: {
  trainingLogs: any;
  model: any;
  modelsInTraining: any;
  setModelsInTraining: any;
}) => {
  const { session, user }: any = authStore();
  const { repo, setRepo }: any = repoStore();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isRetrainOpen,
    onOpen: onRetrainOpen,
    onClose: onRetrainClose,
  } = useDisclosure();
  const [deletingModel, setDeletingModel] = useState<boolean>(false);
  const [savedChanges, setSavedChanges] = useState<boolean>(false);
  const [trainingFailed, setTrainingFailed] = useState<boolean>(false);
  const [isTraining, setIsTraining] = useState<boolean>(false);
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [show, setShow] = useState<boolean>(false);

  const retrainModel = async () => {
    setIsTraining(true);

    // Create a new training_log for this model
    // If a training_log already exists with fulfilled false, don't add a log
    if (
      trainingLogs.filter((log: any) => {
        return (
          log.model_id ===
            createModelID(model.repo, model.owner, model.branch) &&
          log.fulfilled === false
        );
      }).length < 0
    ) {
      await addTrainingLog(model);
    }

    // Set this model to actively train
    const trainingOutput = await trainModel(model, session, user);

    console.log({ trainingOutput });

    //validate the output
    if (trainingOutput?.length) {
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

    if (!model || !model.id) {
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
      .eq("id", model.id)
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

    if (!model || !model.id) {
      console.log("Model is missing required properties.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("models")
        .update({
          deleted: "TRUE",
        })
        .eq("id", model.id)
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
        if (m.id === model.id) {
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
        header="Retrain this model?"
        body="Confirm you would like to retrain this model, you will not be charged if your model has failed to train."
        confirmButtonText="Retrain"
        isOpen={isRetrainOpen}
        onClose={onRetrainClose}
        onSubmit={() => {
          retrainModel();
        }}
      />
      <Card rounded="lg" flexDirection="row">
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
                  <Tooltip label="Edit Model">
                    <IconButton
                      size="sm"
                      onClick={() => setShow(!show)}
                      aria-label="Edit Model"
                      icon={<EditIcon />}
                    />
                  </Tooltip>
                  <Tooltip label="Train Model">
                    <IconButton
                      isDisabled={isTraining}
                      size="sm"
                      onClick={() => {
                        onRetrainOpen();
                      }}
                      aria-label="Train Model"
                      icon={isTraining ? <Spinner size="sm" /> : <MdRefresh />}
                    />
                  </Tooltip>
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
                      : isErrored
                      ? "orange"
                      : JSON.parse(model.output)?.length === 1
                      ? "orange"
                      : isTraining
                      ? "blue"
                      : "teal"
                  }
                  alignSelf="flex-start"
                >
                  Status:{" "}
                  {model.deleted
                    ? "Deleted"
                    : isErrored
                    ? "Training Failed"
                    : JSON.parse(model.output)?.length === 1
                    ? "Training Failed"
                    : isTraining
                    ? "Training"
                    : "Trained"}
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
                {model.owner} - {model.branch}
              </Text>
              <Text fontSize={14}>
                {moment(model.created_at).format("MMMM Do YYYY, h:mm:ss a")}
              </Text>
            </Box>
            <Box>
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
            </Box>
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
    </Box>
  );
};

export default ModelCard;
