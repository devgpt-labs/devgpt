"use client";
import {
  Flex,
  Text,
  Box,
  Tag,
  SlideFade,
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import authStore from "@/store/Auth";
import { supabase } from "@/utils/supabase";
import repoStore from "@/store/Repos";
import { IoMdArrowDown, IoMdArrowDropdown, IoMdArrowUp } from "react-icons/io";
import { EditIcon, DeleteIcon, SmallAddIcon } from "@chakra-ui/icons";
import moment from "moment";

const stages = [
  "generating training data",
  "training data generated",
  "training model with data",
  "model trained",
];

const Training = () => {
  const { user }: any = authStore();
  const { repos }: any = repoStore();

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

  const [modelsInTraining, setModelsInTraining] = useState<Model[]>([
    {
      id: "1",
      created_at: "2021-09-12T18:51:02.000Z",
      user_id: "1",
      repo: "devgpt-web",
      owner: "devgpt-labs",
      branch: "main",
      epochs: 1,
      output: '{"JSON_output": "data"}',
      training_method: "Encoding",
      sample_size: 15,
      frequency: 25,
    },
  ]);

  // const getModels = async () => {
  //   if (!supabase) return;

  //   // Get repos from models table in supabase
  //   const { data, error } = await supabase
  //     .from("models")
  //     .select("*")
  //     .eq("user_id", user.id);

  //   if (!error) {
  //     setModelsInTraining(data);
  //   }
  // };

  // useEffect(() => {
  //   getModels();
  // }, [repos]);

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

  const calculateTotalCost = () => {
    let cost = 0;

    modelsInTraining.forEach((model: any) => {
      const commitsPerDay = 4;
      const daysPerMonth = 30;
      const costPerSample = 0.75; //in dollars
      const trainingsPerMonth =
        (commitsPerDay / model.frequency) * daysPerMonth;
      const costPerTraining = costPerSample * model.epochs * model.sample_size;
      cost += trainingsPerMonth * costPerTraining;
    });

    return cost.toFixed(2);
  };

  const ModelCard = ({ model }: any) => {
    if (!model) return null;

    return (
      <GridItem w="full">
        <Card rounded="lg" p={4}>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="4">
              <Box>
                <Flex justifyContent={"space-between"}>
                  <Heading size="md" mb={2}>
                    {model.repo}
                  </Heading>
                  <Flex flexDirection={"row"}>
                    <IconButton
                      mr={2}
                      aria-label="Delete Model"
                      icon={<DeleteIcon />}
                    />
                    <IconButton aria-label="Edit Model" icon={<EditIcon />} />
                  </Flex>
                </Flex>
                <Badge mb={3} colorScheme="teal">
                  {model.training_method}
                </Badge>
                <Text fontSize={14}>
                  {model.owner} - {model.branch}
                </Text>
              </Box>
              <Box>
                <Grid templateColumns="repeat(2, 1fr)" gap={6}>
                  <GridItem>
                    <Stat>
                      <StatLabel>Epochs</StatLabel>
                      <StatNumber>{model.epochs}</StatNumber>
                      <StatHelpText>
                        {moment(model.created_at).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </StatHelpText>
                    </Stat>
                  </GridItem>
                  <GridItem>
                    <Stat>
                      <StatLabel>Sample_size</StatLabel>
                      <StatNumber>{model.sample_size}</StatNumber>
                      <StatHelpText>
                        {moment(model.created_at).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </StatHelpText>
                    </Stat>
                  </GridItem>
                </Grid>
                <Heading mt={3} size="sm">
                  Training Frequency
                </Heading>
                <Text fontSize={14}>Every {model.frequency} new commits</Text>
              </Box>
            </Stack>
          </CardBody>
        </Card>
      </GridItem>
    );
  };

  return (
    <Flex
      mt={3}
      flexDirection="column"
      w="6xl"
      maxW="full"
      rounded="lg"
      boxShadow="0px 0px 900px 0px blue"
      p={5}
      overflow="hidden"
    >
      <Flex justifyContent={"space-between"} mb={4}>
        <Heading size="lg" mb={2}>
          Models
        </Heading>
        <Button rightIcon={<SmallAddIcon />}>Create</Button>
      </Flex>

      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        {modelsInTraining.length > 0 ? (
          <>
            {modelsInTraining.map((model: any) => {
              return <ModelCard model={model} />;
            })}
          </>
        ) : (
          <Text>No models have been trained yet.</Text>
        )}
      </Grid>
      <Heading size="md" mt={5} mb={3}>
        Training cost
      </Heading>
      <TableContainer>
        <Table variant="striped" colorScheme="gray">
          <TableCaption>
            Costs estimations are based on an assumptions of 5 commits per day.
          </TableCaption>
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
                <Heading>${calculateTotalCost()}</Heading>
              </Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Flex>
  );
};

export default Training;
