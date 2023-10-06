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
import { supabase } from "@/utils/supabase";
import Setup from "@/components/repos/Setup";

//utils
import moment from "moment";

//icons
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiCircleLight } from "react-icons/pi";

const ModelCard = ({
  model,
  modelsInTraining,
  setModelsInTraining,
}: {
  model: any;
  modelsInTraining: any;
  setModelsInTraining: any;
}) => {
  const { repoWindowOpen, setRepoWindowOpen, repo, setRepo }: any = repoStore();
  const [deletingAModel, setDeletingAModel] = useState<boolean>(false);
  const [savedChanges, setSavedChanges] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const [show, setShow] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

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

  if (!model) return null;

  return (
    <>
      <ConfirmationModal
        header="Delete this model?"
        body="Confirm you would like to delete this DevGPT model. This is a
              permanent action but you can always re-add a new model for the
              same repository later on."
        confirmButtonText="Delete"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={deleteModel}
        setDeletingAModel={setDeletingAModel}
        handleModelInTrainingChange={handleModelInTrainingChange}
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
                      onClick={() => {
                        onOpen();
                        setDeletingAModel(model.repo);
                      }}
                      aria-label="Delete Model"
                      icon={
                        deletingAModel === model.repo ? (
                          <Spinner />
                        ) : (
                          <DeleteIcon />
                        )
                      }
                    />
                  </Tooltip>
                  <Tooltip label="Edit Model">
                    <IconButton
                      onClick={() => setShow(!show)}
                      aria-label="Edit Model"
                      icon={<EditIcon />}
                    />
                  </Tooltip>
                  <Tooltip label="Select Model">
                    <IconButton
                      onClick={() => {
                        // TODO: Make sure this is commented back in
                        // if (!model.output) return;

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
              <Flex flexDirection="column" gap={1} mb={3}>
                <Badge
                  colorScheme={
                    model.deleted ? "red" : !model.output ? "orange" : "teal"
                  }
                  alignSelf="flex-start"
                >
                  Status:{" "}
                  {model.deleted
                    ? "Deleted"
                    : !model.output
                      ? "Queued"
                      : "Ready for use"}
                </Badge>
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
          {show && (
            <Flex flexDirection="column" mt={4}>
              <Setup
                repo={model}
                trainingMethod={model.training_method}
                sampleSize={model.sample_size}
                frequency={model.frequency}
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
              />
              <Flex gap={2} mt={4}>
                <Button onClick={() => setShow(false)}>Cancel</Button>
                <Button
                  width="100%"
                  bgGradient="linear(to-r, blue.500,teal.500)"
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
    </>
  );
};

export default ModelCard;
