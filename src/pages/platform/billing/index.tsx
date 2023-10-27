"use client";
import { useState, useEffect } from "react";
import {
  Flex,
  Text,
  Box,
  Skeleton,
  Heading,
  Link,
  Button,
  IconButton,
  useDisclosure,
  Tag,
} from "@chakra-ui/react";

//stores
import authStore from "@/store/Auth";
import repoStore from "@/store/Repos";
import { supabase } from "@/utils/supabase";
import { useRouter } from "next/router";

//utils
import calculateTotalCost from "@/utils/calculateTotalCost";
import getModels from "@/utils/getModels";
import getCustomerSpendThisMonth from "@/utils/stripe/getCustomerSpendThisMonth";

//components
import Template from "@/components/Template";
import BillingSectionHeader from "./BillingSectionHeader";
import BillingTable from "./BillingTable";
import Plans from "./Plans";
import ConfirmationModal from "../models/ConfirmationModal";
import InviteMembers from "./InviteMembers";
import Invites from "./Invites";
import Team from "./Team";
import getOwnedTeams from "@/utils/getOwnedTeams";

//icons
import { ArrowBackIcon } from "@chakra-ui/icons";

const Models = ({ onClose }: any) => {
  const { session, user, stripe_customer_id, invites, setInvites, isPro }: any =
    authStore();
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

  const { repos }: any = repoStore();
  const [loading, setLoading] = useState<boolean>(true);
  const [modelsInTraining, setModelsInTraining] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);
  const [spentThisMonth, setSpentThisMonth] = useState<any>(0);
  const [section, setSection] = useState<any>({
    name: "Billing",
    disabled: false,
  });
  const [teams, setTeams] = useState<any>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);

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
    setSelectedTeam(teams[0]);
  }, [teams]);

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
      console.warn({ error });
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
      console.warn({ error });
      return;
    }
  };

  useEffect(() => {
    // If the url contains the word billing, open the billing section
    getOwnedTeams(setTeams, invites, user?.email);
  }, [setTeams, invites]);

  useEffect(() => {
    getMonthlyBudget();
    getModels(setModelsInTraining, setLoading, user?.email);

    if (modelsInTraining.length > 0) {
      // Get the current budget from supabase
      if (!supabase) return;
    }

    // set budget to a
  }, [repos, refresh]);

  const sections = [
    { name: "Billing", disabled: false },
    { name: "Models", disabled: !isPro ? true : false },
    { name: "Teams", disabled: !isPro ? true : isPro === "individual" ? true : false },
  ];

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
        body="Thank you for updating your budge@t. You can now continue prompting, if this doesn't update immediately, make sure the payment has processed and / or refresh the page."
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
              {sections.map((billingSection: any) => {
                return (
                  <BillingSectionHeader
                    name={billingSection.name}
                    disabled={billingSection.disabled}
                    setSection={setSection}
                    section={section}
                  />
                );
              })}
            </Flex>
          </Flex>
        </Flex>
        <Flex width="100%" flexDirection="column" p={4}>
          <Flex width="100%" justifyContent="space-between" mb={4}>
            <Flex flexDirection="row" alignItems="center" mb={4}>
              <Heading size="md">{section.name}</Heading>
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

          {section.name.toLowerCase() === "models" && (
            <BillingTable
              modelsInTraining={modelsInTraining}
              budget={budget}
              budgetEstimation={budgetEstimation}
            />
          )}

          {section.name.toLowerCase() === "billing" && <Plans />}

          {section.name.toLowerCase() === "teams" && (
            <Box>
              {teams.map((team: any) => {
                return (
                  <Tag
                    colorScheme={selectedTeam === team ? "teal" : "white"}
                    mb={2}
                  >
                    {team.name}
                  </Tag>
                );
              })}

              {isPro === "individual" ||
                (isPro === "member" && (
                  <Invites
                    user={user}
                    team={selectedTeam}
                    invites={invites}
                    setTeam={setSelectedTeam}
                    setInvites={setInvites}
                  />
                ))}

              {isPro === "business" && (
                <>
                  <InviteMembers
                    team={selectedTeam}
                    setTeam={setSelectedTeam}
                  />
                </>
              )}

              <Team team={selectedTeam} />
            </Box>
          )}
        </Flex>
      </Flex>
    </Template>
  );
};

export default Models;
