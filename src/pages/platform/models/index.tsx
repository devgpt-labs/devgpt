"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Box,
  Heading,
  Grid,
  Text,
  Button,
  IconButton,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from "@chakra-ui/react";
import Link from "next/link";
import ModelCard from "./ModelCard";
import ModelInTraining from "./ModelInTraining";
import ModelLoadingScreen from "./ModelLoadingScreen";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";

//components
import Template from "@/components/Template";
import RepoDrawer from "@/components/repos/RepoDrawer";

//icons
import { SmallAddIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { BiRefresh } from "react-icons/bi";
import getModels from "@/utils/getModels";
import AddAModel from "./AddAModel";
import getTrainingLogsForModel from "@/utils/getTrainingLogsForModel";
import createModelID from "@/utils/createModelID";

const Models = () => {
  const { session, user, stripe_customer_id, credits, status }: any =
    authStore();
  const router = useRouter();

  const { repos, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [trainingLogs, setTrainingLogs] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [someModelsAreTraining, setSomeModelsAreTraining] =
    useState<boolean>(false);

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

  const findIfModelsAreTraining = async () => {
    const areModelsTraining = await modelsInTraining.map((model: any) => {
      // If any of the logs in training logs are fulfilled false, return true

      if (
        trainingLogs.filter(
          (log: any) =>
            log.fulfilled === false &&
            log.model_id ===
              createModelID(model.repo, model.owner, model.branch)
        ).length > 0
      ) {
        return true;
      }

      return false;
    });

    // If areModelsTraining array contains a true value, set someModelsAreTraining to true
    const someModelsAreTraining = areModelsTraining.includes(true);
    setSomeModelsAreTraining(someModelsAreTraining);
  };

  useEffect(() => {
    // get data from training_log table
    modelsInTraining.map((model: any) => {
      getTrainingLogsForModel(setTrainingLogs, model);
    });

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

    const training = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "training_log" },
        (payload: any) => {
          const newTrainingLogs = trainingLogs.map((log: any) => {
            if (log.id === payload.new.id) {
              return payload.new;
            }
            return log;
          });

          setTrainingLogs(newTrainingLogs);
        }
      )
      .subscribe();
  }, []);

  useEffect(() => {
    getModels(setModelsInTraining, setLoading, user?.email);
  }, [repos, refresh]);

  useEffect(() => {
    // Find if any models are still training
    findIfModelsAreTraining();
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

  if (loading) return <ModelLoadingScreen />;
  if (modelsInTraining.length === 0) return <AddAModel />;

  return (
    <Template>
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
              isDisabled={credits < 0 || status?.isOverdue}
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
                  trainingLogs={trainingLogs}
                  model={model}
                  modelsInTraining={modelsInTraining}
                  setModelsInTraining={setModelsInTraining}
                />
              );
            })}
          </Grid>
        )}
      </Flex>
      <RepoDrawer />
    </Template>
  );
};

export default Models;
