"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Skeleton,
  Heading,
  Grid,
  Button,
  IconButton,
  useDisclosure,
  useColorMode,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import ConfirmationModal from "./ConfirmationModal";
import Link from "next/link";
import ModelCard from "./ModelCard";
import ModelInTraining from "./ModelInTraining";
import ModelLoadingScreen from "./ModelLoadingScreen";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";

//utils
import calculateTotalCost from "@/utils/calculateTotalCost";

//components
import Template from "@/components/Template";
import RepoDrawer from "@/components/repos/RepoDrawer";

//icons
import { SmallAddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { BiRefresh } from "react-icons/bi";
import trainModels from "@/utils/trainModels";
import getModels from "@/utils/getModels";
import AddAModel from "./AddAModel";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [trainingLogs, setTrainingLogs] = useState<any>([]);
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
  }, []);

  useEffect(() => {
    getMonthlyBudget();
    getModels(setModelsInTraining, setLoading, user?.email);

    // set budget to a
  }, [repos, refresh]);

  useEffect(() => {
    console.log({ modelsInTraining });
  }, [modelsInTraining]);

  useEffect(() => {
    if (!supabase) return;
    const models = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "models" },
        (payload: any) => {
          if (payload.new.stripe_customer_id === stripe_customer_id) {
            // Update modelsInTraining ith the payload.new of the corresponding model
            setModelsInTraining((modelsInTraining: any) => {
              const newModelsInTraining = modelsInTraining.map(
                (model: Model) => {
                  if (model.id === payload.new.id) {
                    return payload.new;
                  }
                  return model;
                }
              );
              return newModelsInTraining;
            });
          }
        }
      )
      .subscribe();
  }, []);

  if (loading || budget === null) return <ModelLoadingScreen />;
  if (modelsInTraining.length === 0) return <AddAModel />;

  const someModelsAreTraining = modelsInTraining.some((model: any) => {
    // find if the model has a training log open
    if (JSON.parse(model?.output).length === 1) return true;
  });

  console.log({ modelsInTraining });


  return (
    <Template>
      <ConfirmationModal
        header={`Set your monthly budget to $${budget}?`}
        body="Confirm you would like to change your budget. This can be changed at any time."
        confirmButtonText="Confirm"
        isOpen={isConfirmationOpen}
        onClose={onConfirmationClose}
        onSubmit={saveMonthlyBudget}
        setLoadingState={setLoading}
      />
      <Flex
        flex={1}
        w="full"
        overflowY="scroll"
        height="100vh"
        flexDirection="column"
        p={4}
      >
        <Flex alignItems="center" justifyContent="space-between" gap={3} mb={3}>
          <Flex flexDirection="row" alignItems="center">
            <Link href="/platform/agent">
              <IconButton
                onClick={() => {
                  router.back();
                }}
                aria-label="Close"
                icon={<ArrowBackIcon />}
              />
            </Link>
            <Heading size="md" ml={4}>
              Trained Models
            </Heading>
          </Flex>
          <Flex gap={2}>
            <Button
              onClick={() => {
                setRepoWindowOpen(!repoWindowOpen);
              }}
              rightIcon={<SmallAddIcon />}
            >
              Create
            </Button>
            <Button
              onClick={() => {
                setRefresh(!refresh);
              }}
              rightIcon={<BiRefresh />}
            >
              Refresh
            </Button>
          </Flex>
        </Flex>
        <Accordion allowMultiple index={[0, 1]}>
          {someModelsAreTraining && (
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box as="span" flex="1" textAlign="left" mt={2}>
                    Models Being Trained
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <Flex width="100%" flexDirection="column" mb={4}>
                  {modelsInTraining.map((model: any) => {
                    return <ModelInTraining model={model} />;
                  })}
                </Flex>
              </AccordionPanel>
            </AccordionItem>
          )}
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box as="span" flex="1" textAlign="left" mt={2}>
                  Trained Models
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>

            <AccordionPanel pb={4}>
              {modelsInTraining.length > 0 && (
                <Grid templateColumns="repeat(3, 1fr)" gap={6} flexWrap="wrap">
                  {modelsInTraining.map((model: any) => {
                    return (
                      <ModelCard
                        model={model}
                        modelsInTraining={modelsInTraining}
                        setModelsInTraining={setModelsInTraining}
                      />
                    );
                  })}
                </Grid>
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
      <RepoDrawer />
    </Template>
  );
};

export default Models;
