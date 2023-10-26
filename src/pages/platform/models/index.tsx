"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Heading,
  Grid,
  Text,
  Button,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  Box,
  ModalHeader,
  ModalFooter,
  ModalBody,
} from "@chakra-ui/react";
import ModelCard from "./ModelCard";
import ModelLoadingScreen from "./ModelLoadingScreen";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";

//components
import Template from "@/components/Template";
import RepoDrawer from "@/components/repos/RepoDrawer";
import { AiFillCreditCard } from "react-icons/ai";

//icons
import { SmallAddIcon } from "@chakra-ui/icons";
import { BiRefresh } from "react-icons/bi";
import getModels from "@/utils/getModels";
import AddAModel from "./AddAModel";
import createModelID from "@/utils/createModelID";

const Models = () => {
  const { session, user, stripe_customer_id, credits, isPro }: any =
    authStore();
  const router = useRouter();

  const { repos, repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

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
    getModels(setModelsInTraining, setLoading, user?.email);
  }, [repos, refresh]);

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

  if (loading || !user) return <ModelLoadingScreen />;
  if (modelsInTraining.length === 0 && isPro)
    return <AddAModel setRefresh={setRefresh} refresh={refresh} />;

  if (!isPro) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="100%"
          p={4}
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Modal isOpen={true} onClose={() => { }} isCentered={true}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>It's time to upgrade</ModalHeader>
              <ModalBody>
                <Text>
                  To use DevGPT, you need a plan that unlocks its full
                  potential. This allows you to train models and run prompts.
                </Text>
              </ModalBody>

              <ModalFooter>
                <Button
                  width="100%"
                  bgGradient="linear(to-r, blue.500, teal.500)"
                  color="white"
                  onClick={() => {
                    router.push("/platform/billing");
                  }}
                >
                  <Text mr={2}>Billing</Text>
                  <AiFillCreditCard />
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          <Box width="100vw">
            <Flex width="100%" mb={6} justifyContent="space-between">
              <Skeleton
                bg="gray.700"
                height="35px"
                width="250px"
                borderRadius={10}
              />
              <Flex flexDirection="row" gap={4}>
                <Skeleton
                  bg="gray.700"
                  height="35px"
                  width="150px"
                  borderRadius={10}
                />
                <Skeleton
                  bg="gray.700"
                  height="35px"
                  width="150px"
                  borderRadius={10}
                />
                <Skeleton
                  bg="gray.700"
                  height="35px"
                  width="150px"
                  borderRadius={10}
                />
              </Flex>
            </Flex>
            <Grid
              templateColumns="repeat(3, 1fr)"
              gap={8}
              flexWrap="wrap"
              width="100%"
            >
              <Skeleton bg="gray.700" height="250px" borderRadius={10} />
              <Skeleton bg="gray.700" height="250px" borderRadius={10} />
              <Skeleton bg="gray.700" height="250px" borderRadius={10} />
              <Skeleton bg="gray.700" height="250px" borderRadius={10} />
              <Skeleton bg="gray.700" height="250px" borderRadius={10} />
            </Grid>
          </Box>
        </Flex>
      </Template>
    );
  }

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
            {/* <Link href="/platform/agent">
              <IconButton
                onClick={() => {
                  router.back();
                }}
                aria-label="Close"
                icon={<ArrowBackIcon />}
              />
            </Link> */}
            <Heading size="md">Trained Models</Heading>
          </Flex>
          <Flex gap={2}>
            <Button
              onClick={() => {
                setRefresh(!refresh);
              }}
              rightIcon={<BiRefresh />}
            >
              Refresh
            </Button>
            <Button
              isDisabled={!isPro}
              onClick={() => {
                setRepoWindowOpen(!repoWindowOpen);
              }}
              rightIcon={<SmallAddIcon />}
            >
              Train New Model
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
                  id={model.id}
                  model={model}
                  modelsInTraining={modelsInTraining}
                  setModelsInTraining={setModelsInTraining}
                />
              );
            })}
          </Grid>
        )}
      </Flex>
      <RepoDrawer setRefresh={setRefresh} refresh={refresh} />
    </Template>
  );
};

export default Models;
