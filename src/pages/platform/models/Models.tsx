"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  SlideFade,
  Skeleton,
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
  StatHelpText,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useColorMode,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
} from "@chakra-ui/react";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import Setup from "@/components/repos/Setup";

//utils
import moment from "moment";
import calculateTotalCost from "@/utils/calculateTotalCost";
import getModels from "@/utils/getModels";


//icons
import {
  EditIcon,
  DeleteIcon,
  SmallAddIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { BiCircle, BiSolidDollarCircle } from "react-icons/bi";
import { PiSelectionBackground } from "react-icons/pi";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiCircleLight } from "react-icons/pi";

const ModelCard = ({ model, onClose }: any) => {
  const { repoWindowOpen, setRepoWindowOpen, repo, setRepo }: any = repoStore();
  const { colorMode } = useColorMode();
  const [show, setShow] = useState<boolean>(false);

  const deleteModel = async () => {
    if (!supabase) return;

    const { error } = await supabase.from("models").delete().eq("id", model.id);

    if (!error) {
      return;
    }
  };

  if (!model) return null;

  return (
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
              <Badge colorScheme="teal" alignSelf="flex-start">
                In Use: {repo.repo === model.repo ? 'TRUE' : 'FALSE'}
              </Badge>
              <Badge colorScheme="teal" alignSelf="flex-start">
                Method: {model.training_method}
              </Badge>
              <Badge colorScheme="teal" alignSelf="flex-start">
                Status: Ready To Use
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
              setCycles={() => { }}
              setFrequency={() => { }}
              setEpochs={() => { }}
              setTrainingMethod={() => { }}
            />
          </Flex>
        )}
      </CardBody>
    </Card>
  );
};

const Models = ({ onClose }: any) => {
  const { user, stripe_customer_id }: any = authStore();
  const { colorMode }: any = useColorMode();
  const { repos, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const [showBilling, setShowBilling] = useState<boolean>(false);
  const [budget, setBudget] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [modelsInTraining, setModelsInTraining] = useState<Model[]>([]);

  interface Model {
    id: string;
    created_at: string;
    user_id: string;
    repo: string;
    owner: string;
    branch: string;
    epochs: number;
    output: string;
    training_method: string;
    sample_size: number;
    frequency: number;
  }

  const handleBudgetChange = (e: any) => {
    setBudget(e.target.value);
  };

  useEffect(() => {
    getModels(
      setModelsInTraining,
      setLoading,
      stripe_customer_id,
    );
  }, [repos]);

  const calculateStatSum = (stat: string) => {
    return modelsInTraining.length > 0 ? (
      <>
        {modelsInTraining
          .map((model: any) => model?.[stat])
          .reduce((a: any, b: any) => a + b, 0)}
      </>
    ) : (
      0
    );
  };

  return (
    <Modal onClose={onClose} isOpen={true} size="full">
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <Flex
          overflowY="scroll"
          height="100vh"
          flexDirection="column"
          p={4}
          bg={colorMode === "light" ? "gray.50" : "black"}
        >
          <Flex
            alignItems="center"
            justifyContent="space-between"
            gap={3}
            mb={3}
            mr={10}
          >
            <Flex flexDirection="row" alignItems="center">
              <IconButton
                onClick={onClose}
                aria-label="Close"
                icon={<ArrowBackIcon />}
              />
              <Heading size="md" ml={4}>
                Models
              </Heading>
            </Flex>
            <Flex gap={2}>
              <Button
                onClick={() => {
                  setRepoWindowOpen(!repoWindowOpen);
                  onClose();
                }}
                rightIcon={<SmallAddIcon />}
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  if (showBilling) return setShowBilling(false);

                  setShowBilling(true);
                  const element = document.getElementById("billing");
                  element?.scrollIntoView({ behavior: "smooth" });
                }}
                rightIcon={<BiSolidDollarCircle />}
              >
                Billing
              </Button>
            </Flex>
          </Flex>

          {loading ? (
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              <Flex flexDirection="row" gap={4}>
                <Skeleton width="400px" height="400px" />
                <Skeleton width="400px" height="400px" />
                <Skeleton width="400px" height="400px" />
              </Flex>
            </Grid>
          ) : modelsInTraining.length > 0 ? (
            <Grid templateColumns="repeat(3, 1fr)" gap={3}>
              {modelsInTraining.map((model: any) => {
                return <ModelCard onClose={onClose} model={model} />;
              })}
            </Grid>
          ) : (
            <Flex
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              gap={2}
              width="100%"
              height="100%"
            >
              <Text>No models found yet</Text>
              <Button
                onClick={() => {
                  setRepoWindowOpen(!repoWindowOpen);
                  onClose();
                }}
                rightIcon={<SmallAddIcon />}
              >
                Train A New Model
              </Button>
            </Flex>
          )}
          <SlideFade in={showBilling} offsetY="20px" id="billing">
            <>
              <Heading size="md" mt={5} mb={3}>
                Billing and Model Cost
              </Heading>
              <Text mb={2}>Monthly Budget</Text>
              <InputGroup>
                <InputLeftAddon children="$" />
                <Input
                  value={budget}
                  onChange={handleBudgetChange}
                  type="number"
                  placeholder="per month"
                />
                <InputRightElement width='4.5rem'>
                  <Button h='1.75rem' size='sm' onClick={() => { }}>
                    Save
                  </Button>
                </InputRightElement>
              </InputGroup>
              <TableContainer>
                <Table variant="striped">
                  <Thead>
                    <Tr>
                      <Th>Model name</Th>
                      <Th isNumeric>Epochs</Th>
                      <Th isNumeric>Sample_Size</Th>
                      <Th isNumeric>Frequency</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {modelsInTraining.length > 0 ? (
                      <>
                        {modelsInTraining.map((model: any) => {
                          return (
                            <>
                              <Tr>
                                <Td>{model.repo}</Td>
                                <Td isNumeric>{model.epochs}</Td>
                                <Td isNumeric>{model.sample_size}</Td>
                                <Td isNumeric>{model.frequency}</Td>
                              </Tr>
                            </>
                          );
                        })}
                      </>
                    ) : (
                      <Text>No models have been trained yet.</Text>
                    )}
                  </Tbody>
                  <Tfoot>
                    <Tr>
                      <Th>Usage</Th>
                      <Th isNumeric>{calculateStatSum("epochs")}</Th>
                      <Th isNumeric>{calculateStatSum("sample_size")}</Th>
                      <Th isNumeric>{calculateStatSum("frequency")}</Th>
                    </Tr>
                    <Tr>
                      <Th>Estimated monthly cost</Th>
                      <Th isNumeric></Th>
                      <Th isNumeric></Th>
                      <Th isNumeric>
                        <Heading>
                          ${calculateTotalCost(modelsInTraining, budget)}
                        </Heading>
                      </Th>
                    </Tr>
                  </Tfoot>
                </Table>
              </TableContainer>
            </>
          </SlideFade>
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default Models;
