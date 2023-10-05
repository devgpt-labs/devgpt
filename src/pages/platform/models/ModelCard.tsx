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
} from "@chakra-ui/react";

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

const ModelCard = ({ model, modelsInTraining, setModelsInTraining }: any) => {
  const { repoWindowOpen, setRepoWindowOpen, repo, setRepo }: any = repoStore();
  const [deletingAModel, setDeletingAModel] = useState<boolean>(false);
  const { colorMode } = useColorMode();
  const [show, setShow] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const deleteModel = async () => {
    if (!supabase) return;

    const { error } = await supabase.from("models").delete().eq("id", model.id);

    if (!error) {
      return;
    }
  };

  // Find our model in the modelsintraining array
  const modelInTraining = modelsInTraining.find((m: any) => m.id === model.id);

  // Set the repo name to the model in training
  setModelsInTraining(
    modelsInTraining.map((m: any) => {
      if (m.id === model.id) {
        return {
          ...m,
          name: "hello",
        };
      }

      return m;
    })
  );

  const updateModel = async () => {
    if (!supabase) return;

    const { error } = await supabase
      .from("models")
      .update({
        frequency: 1,
        sample_size: 1,
        training_method: "fine-tune",
        epochs: 1,
      })
      .eq("id", model.id);

    if (!error) {
      return;
    }
  };

  const AreYouSureModal = ({
    isOpen,
    onClose,
  }: {
    isOpen: boolean;
    onClose: () => void;
  }) => {
    return (
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  if (!model) return null;

  return (
    <>
      <AreYouSureModal isOpen={isOpen} onClose={onClose} />
      <Card rounded="lg" p={4} flexDirection="row">
        <CardBody>
          <Stack divider={<StackDivider />} spacing="4">
            <Box>
              <Flex justifyContent={"space-between"}>
                <Heading size="md" mb={2}>
                  {model.repo}
                </Heading>
                <Flex flexDirection={"row"} gap={2}>
                  <IconButton
                    onClick={deleteModel}
                    aria-label="Delete Model"
                    icon={<DeleteIcon />}
                  />
                  <IconButton
                    onClick={() => setShow(!show)}
                    aria-label="Edit Model"
                    icon={<EditIcon />}
                  />
                  <IconButton
                    onClick={() => {
                      if (!model.output) return;

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
                </Flex>
              </Flex>
              <Flex flexDirection="column" gap={1} mb={3}>
                <Badge
                  colorScheme={!model.output ? "orange" : "teal"}
                  alignSelf="flex-start"
                >
                  Status: {!model.output ? "Queued" : "Ready for use"}
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
                    <Text fontSize={10}>Train every X commits</Text>
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
                cycles={model.sample_size}
                frequency={model.frequency}
                epochs={model.epochs}
                setCycles={() => {
                  // update model.sample_size
                }}
                setFrequency={() => { }}
                setEpochs={() => { }}
                setTrainingMethod={() => { }}
              />
            </Flex>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default ModelCard;
