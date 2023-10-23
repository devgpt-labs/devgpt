"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Skeleton,
  Heading,
  Tag,
  Badge,
  Link,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  useDisclosure,
  useColorMode,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Tooltip,
  Modal,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";

//utils
import calculateTotalCost from "@/utils/calculateTotalCost";
import getModels from "@/utils/getModels";
import chargeCustomer from "@/utils/stripe/chargeCustomer";

//components
import Template from "@/components/Template";

//icons
import { ArrowBackIcon } from "@chakra-ui/icons";
import { RiInformationFill } from "react-icons/ri";
import getCustomerSpendThisMonth from "@/utils/stripe/getCustomerSpendThisMonth";
import ConfirmationModal from "../models/ConfirmationModal";
import CreditsModal from "@/components/repos/CreditsModal";

const calculateStatSum = (stat: string, modelsInTraining: any) => {
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

const Models = ({ onClose }: any) => {
  const { session, user, stripe_customer_id, credits }: any = authStore();
  const router = useRouter();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
    onToggle: onConfirmationToggle,
  } = useDisclosure();

  const {
    isOpen: isThankYouOpen,
    onOpen: onThankYouOpen,
    onClose: onThankYouClose,
  } = useDisclosure();

  const {
    isOpen: isCreditsOpen,
    onOpen: onCreditsOpen,
    onClose: onCreditsClose,
  } = useDisclosure();

  const { repos }: any = repoStore();
  const [showBilling, setShowBilling] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [spentThisMonth, setSpentThisMonth] = useState<any>(0);
  const [section, setSection] = useState<string>("Credit");

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
    const setMonthlySpend = async () => {
      if (spentThisMonth != 0) return;

      const spend = await getCustomerSpendThisMonth(stripe_customer_id);
      setSpentThisMonth(spend || 0);
    };

    setMonthlySpend();
  }, [stripe_customer_id]);

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
  };

  useEffect(() => {
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

  const sections = ["Credit", "Models"];
  // const sections = ["Credit", "Models", "Plans"];

  if (loading || budget === null || !user) {
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
      <ConfirmationModal
        header={`Change monthly budget to $${budget}?`}
        body="Changing your monthly budget will affect how much you can spend on models and prompting."
        confirmButtonText="Confirm"
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        onSubmit={() => {
          saveMonthlyBudget();
          onThankYouOpen();
          onConfirmationClose();
        }}
      />

      <ConfirmationModal
        header={`Budget Updated Successfully`}
        body="Thank you for updating your budget. You can now continue prompting, if this doesn't update immediately, make sure the payment has processed and / or refresh the page."
        confirmButtonText="Complete"
        isOpen={isThankYouOpen}
        onClose={onThankYouClose}
        onSubmit={() => {
          onThankYouClose();
          router.push("/platform/agent", undefined, { shallow: true });
        }}
      />

      {/* <CreditsModal isCreditsOpen={isCreditsOpen} onCreditsClose={onCreditsClose} /> */}
      {/* <Tag
        cursor="pointer"
        onClick={() => {
          onCreditsOpen();
        }}
      >
        Add Credits
      </Tag> */}
      <Flex flexDirection="row" width="100%">
        <Flex flexDirection="column" px={8} pt={4}>
          <Text fontWeight="bold" mb={4}>
            Billing
          </Text>
          <Flex flexDirection="row">
            <Flex flexDirection="column">
              {sections.map((title) => {
                return (
                  <BillingSectionHeader
                    title={title}
                    setSection={setSection}
                    section={section}
                  />
                );
              })}
            </Flex>
          </Flex>
        </Flex>
        <Flex mb={3} width="100%" flexDirection="column" p={4}>
          <Flex width="100%" justifyContent="space-between">
            <Flex flexDirection="row" alignItems="center" mb={4}>
              <Heading size="md">{section}</Heading>
            </Flex>
            <Flex gap={2}>
              <Link
                isExternal={true}
                href="https://billing.stripe.com/p/login/dR67ww9NDcB2gNO8ww"
              >
                <Button>Manage Payment Methods</Button>
              </Link>
              <Link
                isExternal={true}
                href="https://billing.stripe.com/p/login/dR67ww9NDcB2gNO8ww"
              >
                <Button>Manage Payments</Button>
              </Link>
            </Flex>
          </Flex>

          {section.toLowerCase() === "credit" && (
            <BudgetAndCredit
              budget={budget}
              setBudget={setBudget}
              promptingBalance={promptingBalance}
              spentThisMonth={spentThisMonth}
              onConfirmationOpen={onConfirmationOpen}
            />
          )}

          {section.toLowerCase() === "models" && (
            <BillingTable
              modelsInTraining={modelsInTraining}
              budget={budget}
              budgetEstimation={budgetEstimation}
            />
          )}

          {section.toLowerCase() === "plans" && <Plans />}
        </Flex>
      </Flex>
    </Template>
  );
};

export default Models;

const BillingSectionHeader = ({ title, setSection, section }: any) => {
  return (
    <Text
      _hover={{
        borderLeft: "solid 2px",
        borderColor: "blue.200",
      }}
      py={1}
      cursor="pointer"
      borderLeft='2px solid'
      borderColor={section === title ? "blue.800" : "gray.200"}
      pl={3}
      fontSize="sm"
      onClick={() => {
        setSection(title);
      }}
    >
      {title}
    </Text>
  );
};

const Plans = () => {
  return (
    <>
      <Text>Plan 1 </Text>
    </>
  );
};

const BudgetAndCredit = ({
  budget,
  setBudget,
  promptingBalance,
  spentThisMonth,
  onConfirmationOpen,
}: any) => {
  const { credits }: any = authStore();

  const handleBudgetChange = (e: any) => {
    setBudget(e.target.value);
  };

  return (
    <>
      <Heading size="sm" mt={2}>
        Current Balance: <Tag>${credits?.toFixed(2) || 0}</Tag>{" "}
      </Heading>
      <Heading size="sm" mb={4} mt={2}>
        Spend this month: <Tag>${spentThisMonth?.toFixed(2) || 0}</Tag>
      </Heading>
      <Flex flexDirection="row" alignItems="center" gap={2} mb={2}>
        <Text fontSize={14}>Monthly Budget</Text>
        <Tooltip
          placement="right"
          label="Your monthly budget is a hard-limit to how much will be allowed to spend on your account of models plus prompting. During automatic recharges or model creation, this budget will be taken into consideration."
        >
          <Box>
            <RiInformationFill />
          </Box>
        </Tooltip>
      </Flex>
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
      {promptingBalance === 0 ? (
        <Badge alignSelf="flex-start" mt={2} color="orange">
          This budget will limit your models from reaching your settings and
          give you $0 budget for prompting.
        </Badge>
      ) : (
        <Badge
          color={promptingBalance === 0 ? "orange" : "teal"}
          alignSelf="flex-start"
          mt={2}
        >
          This budget give you a monthly balance for prompting of $
          {promptingBalance.toFixed(2)}
        </Badge>
      )}
    </>
  );
};

const BillingTable = ({ modelsInTraining, budget, budgetEstimation }: any) => {
  return (
    <>
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
              <Th isNumeric>{calculateStatSum("epochs", modelsInTraining)}</Th>
              <Th isNumeric>
                {calculateStatSum("sample_size", modelsInTraining)}
              </Th>
              <Th isNumeric>
                {calculateStatSum("frequency", modelsInTraining)}
              </Th>
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
    </>
  );
};
