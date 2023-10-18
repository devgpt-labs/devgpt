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
import createModelID from "@/utils/createModelID";
import getTrainingLogsForModel from "@/utils/getTrainingLogsForModel";

const Models = ({ onClose }: any) => {
  const { session, user, stripe_customer_id, credits, status }: any =
    authStore();
  const router = useRouter();
  const {
    isOpen: isConfirmationOpen,
    onOpen: onConfirmationOpen,
    onClose: onConfirmationClose,
    onToggle: onConfirmationToggle,
  } = useDisclosure();

  const { repos, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [trainingLogs, setTrainingLogs] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [budget, setBudget] = useState<any>(null);
  const [someModelsAreTraining, setSomeModelsAreTraining] =
    useState<boolean>(false);
  const [budgetEstimation, setBudgetEstimation] = useState<number>(0);

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

  const findIfModelsAreTraining = async () => {
    const areModelsTraining = await modelsInTraining.map((model: any) => {
      if (!model.output) return true;
      if (JSON.parse(model?.output).length === 1) return true;

      return false
    });

    // If areModelsTraining array contains a true value, set someModelsAreTraining to true
    const someModelsAreTraining = areModelsTraining.includes(true);
    setSomeModelsAreTraining(someModelsAreTraining);
  };

  console.log(someModelsAreTraining);


  useEffect(() => {
    // Train models
    trainModels(session, user);

    // get data from training_log table
    getTrainingLogsForModel(setTrainingLogs, user);

    // Subscribe to output changes
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

  useEffect(() => {
    getMonthlyBudget();
    getModels(setModelsInTraining, setLoading, user?.email);
  }, [repos, refresh]);

  useEffect(() => {
    // Find if any models are still training
    findIfModelsAreTraining();

    // Set budget estimation
    setBudgetEstimation(Number(calculateTotalCost(modelsInTraining, 0)) * 1.2);
  }, [modelsInTraining]);

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

  if (loading || budget === null) return <ModelLoadingScreen />;
  if (modelsInTraining.length === 0) return <AddAModel />;

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
            {credits < 0 || status?.isOverdue || (
              <Button
                onClick={() => {
                  setRepoWindowOpen(!repoWindowOpen);
                }}
                rightIcon={<SmallAddIcon />}
              >
                Create
              </Button>
            )}

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
        <Accordion allowMultiple defaultIndex={[0, 1]}>
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
                <Grid
                  width="100%"
                  templateColumns={`repeat(3, 1fr)`}
                  gap={6}
                  flexWrap="wrap"
                >
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
