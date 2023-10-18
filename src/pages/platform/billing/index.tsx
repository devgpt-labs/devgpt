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
  Tag,
  Grid,
  GridItem,
  Badge,
  StackDivider,
  Stack,
  Stat,
  Link,
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
  useDisclosure,
  ModalCloseButton,
  useColorMode,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import Setup from "@/components/repos/Setup";
import { useRouter } from "next/router";

//utils
import moment from "moment";
import calculateTotalCost from "@/utils/calculateTotalCost";
import getModels from "@/utils/getModels";

//components
import Template from "@/components/Template";
import RepoDrawer from "@/components/repos/RepoDrawer";

//icons
import {
  EditIcon,
  DeleteIcon,
  SmallAddIcon,
  ArrowBackIcon,
} from "@chakra-ui/icons";
import { BiCircle, BiRefresh, BiSolidDollarCircle } from "react-icons/bi";
import { PiSelectionBackground } from "react-icons/pi";
import { AiFillCheckCircle } from "react-icons/ai";
import { PiCircleLight } from "react-icons/pi";
import trainModels from "@/utils/trainModels";
import { BsBack } from "react-icons/bs";

const Models = ({ onClose }: any) => {
  const { session, user, stripe_customer_id, credits }: any = authStore();
  const router = useRouter();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
    onToggle: onConfirmationToggle,
  } = useDisclosure();

  const { colorMode }: any = useColorMode();
  const { repos, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const [showBilling, setShowBilling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  // Budgets
  const [budget, setBudget] = useState<any>(null);

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

  useEffect(() => {
    if (!session) {
      console.log("no session found, returning to home");
      router.push("/", undefined, { shallow: true });
    }

    if (!user) {
      console.log("no user found, returning to home");
      router.push("/", undefined, { shallow: true });
    }
  }, [session, user]);

  // Used to show how much the user will have available for prompting
  const balanceCalculation =
    Number(budget) - Number(calculateTotalCost(modelsInTraining, 0));
  let promptingBalance = balanceCalculation;
  if (promptingBalance < 0) {
    promptingBalance = 0;
  }

  // Used to get an estimation of how much the user will spend each month
  const budgetEstimation =
    Number(calculateTotalCost(modelsInTraining, 0)) * 1.2;

  const handleBudgetChange = (e: any) => {
    setBudget(e.target.value);
  };

  const getMonthlyBudget = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("customers")
      .select("monthly_budget")
      .eq("email_address", user?.email)
      .single();

    if (error) {
      console.log(error);
      setBudget(budgetEstimation);
      return;
    }

    if (data) {
      setBudget(data.monthly_budget);
    }
  };

  const saveMonthlyBudget = async () => {
    if (!supabase) return;
    const { data, error } = await supabase
      .from("customers")
      .update({ monthly_budget: budget })
      .eq("email_address", user?.email);

    if (error) {
      console.log(error);
      return;
    }
    if (data) {
      console.log("new budget saved");
    }
  };

  useEffect(() => {
    // Train models
    trainModels(session, user);

    // If the url contains the word billing, open the billing section
    if (router.asPath.includes("billing")) {
      // Show billing section
      setShowBilling(true);

      // TODO: This is a hacky fix to scroll to billing after render
      setTimeout(() => {
        const element = document.getElementById("billing");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, []);

  useEffect(() => {
    getMonthlyBudget();
    getModels(setModelsInTraining, setLoading, user?.email);

    if (modelsInTraining.length > 0) {
      // Get the current budget from supabase
      if (!supabase) return;
    }

    // set budget to a
  }, [repos, refresh]);

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

  if (loading || budget === null) {
    return (
      <Template>
        <Box p={6} width="100vw" height="100vh">
          <Flex width="100%" mb={4}>
            <IconButton
              aria-label="Refresh"
              icon={<ArrowBackIcon />}
              onClick={router.back}
              mr={4}
            />
            <Skeleton
              width="200px"
              bg="gray.700"
              height="40px"
              borderRadius={10}
            />
          </Flex>
          <Skeleton bg="gray.700" height="40px" mb={4} borderRadius={10} />
          <Skeleton bg="gray.700" height="60px" my={2} borderRadius={10} />
          <Skeleton bg="gray.700" height="0.5px" borderRadius={10} />
          <Skeleton bg="gray.700" height="60px" my={2} borderRadius={10} />
          <Skeleton bg="gray.700" height="0.5px" borderRadius={10} />
          <Skeleton bg="gray.700" height="60px" my={2} borderRadius={10} />
        </Box>
      </Template>
    );
  }

  return (
    <Template>
      <Box p={5} width="100%" height="100%">
        <Flex flexDirection="row" alignItems="center" justifyContent='space-between' mb={3}>
          <Flex flexDirection='row' alignItems="center" >
            <IconButton
              mr={3}
              onClick={() => {
                router.back();
              }}
              aria-label="Close"
              icon={<ArrowBackIcon />}
            />
            <Heading size="md" ml={4}>
              Billing
            </Heading></Flex>

          <Link isExternal={true} href="https://billing.stripe.com/p/login/dR67ww9NDcB2gNO8ww">
            <Button>Manage Payments</Button>
          </Link>
        </Flex>

        <Flex flexDirection={"column"} mb={3}>
          <Heading size="md" mb={4} mt={2}>
            Current Balance: <Tag>${credits?.toFixed(2) || 0}</Tag>
          </Heading>
          <Text mb={2}>Monthly Budget</Text>
          <InputGroup>
            <InputLeftAddon children="$" />
            <Input
              max={10000000}
              value={budget}
              type="number"
              onChange={handleBudgetChange}
            />
            <InputRightElement width="4.5rem">
              <Button
                color="white"
                bgGradient={"linear(to-r, blue.500,teal.500)"}
                h="1.75rem"
                size="sm"
                onClick={onConfirmationOpen}
              >
                Save
              </Button>
            </InputRightElement>
          </InputGroup>
          <Badge
            color={promptingBalance === 0 ? "orange" : "teal"}
            alignSelf="flex-start"
            mt={2}
          >
            This budget give you a monthly balance for prompting of $
            {promptingBalance.toFixed(2)}
          </Badge>
          {promptingBalance === 0 && (
            <Badge alignSelf="flex-start" mt={2} color="orange">
              This budget will limit your models from reaching your settings.
            </Badge>
          )}
        </Flex>
        <TableContainer>
          <Table variant="striped">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th isNumeric>Epochs</Th>
                <Th isNumeric>Sample_Size</Th>
                <Th isNumeric>Frequency</Th>
                <Th isNumeric>Cost</Th>
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
                          <Td isNumeric>${calculateTotalCost([model], 0)}</Td>
                        </Tr>
                      </>
                    );
                  })}
                </>
              ) : (
                <Text my={4}>No models have been trained yet.</Text>
              )}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Total</Th>
                <Th isNumeric>{calculateStatSum("epochs")}</Th>
                <Th isNumeric>{calculateStatSum("sample_size")}</Th>
                <Th isNumeric>{calculateStatSum("frequency")}</Th>
                <Th isNumeric>${calculateTotalCost(modelsInTraining, 0)}</Th>
              </Tr>
              <Tr>
                <Th>Estimated monthly cost</Th>
                <Th isNumeric></Th>
                <Th isNumeric></Th>
                <Th isNumeric></Th>
                <Th isNumeric>
                  <Heading>
                    $
                    {budget < budgetEstimation
                      ? budget
                      : budgetEstimation.toFixed(2)}
                  </Heading>
                </Th>
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Box>
    </Template>
  );
};

export default Models;
