"use client";
import {
  Flex,
  Text,
  Box,
  Heading,
  Tag,
  Badge,
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Tooltip,
} from "@chakra-ui/react";

//stores
import authStore from "@/store/Auth";

//icons
import { RiInformationFill } from "react-icons/ri";

const BudgetAndCredit = ({
  budget,
  setBudget,
  promptingBalance,
  spentThisMonth,
  onConfirmationOpen,
}: any) => {
  const { credits, isPro }: any = authStore();

  const handleBudgetChange = (e: any) => {
    setBudget(e.target.value);
  };

  return (
    <Flex flexDirection="column">
      <Heading size="sm" mt={2}>
        Current Plan:{' '}
        <Badge colorScheme="teal" alignSelf="flex-start">
          Premium
        </Badge>
      </Heading>
      {/* <Heading size="sm" mb={4} mt={2}>
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
      )} */}
    </Flex>
  );
};

export default BudgetAndCredit;
