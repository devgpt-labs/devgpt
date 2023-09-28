"use client";
import { useEffect, useState } from "react";
import { Box, Flex, Text, SkeletonText, Input, Button } from "@chakra-ui/react";
import { useCompletion } from "ai/react";

//stores
import repoStore from "@/store/Repos";
import messageStore from "@/store/Messages";
import authStore from "@/store/Auth";

//prompts
import userPrompt from "@/prompts/user";

//components
import Response from "@/components/Response";
import Profile from "@/components/repos/Profile";
import { PromptInput } from "./PromptInput";
import { ConversationStyleToggle } from "./RateConversation";
import { Header } from "./ChatHeader";

//utils
import { savePrompt } from "@/utils/savePrompt";
import getTokensFromString from "@/utils/getTokensFromString";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import { checkIfPro } from "@/utils/checkIfPro";

const Chat = () => {
  const [response, setResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [failMessage, setFailMessage] = useState<string>("");
  const [promptCount, setPromptCount] = useState<number>(0);
  const [prompt, setPrompt] = useState<string>("");

  const { repo }: any = repoStore();
  // const { messages, setMessages }: any = messageStore();
  const { user, session }: any = authStore();

  const { completion, handleInputChange, handleSubmit } = useCompletion();

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  // todo move this to session context
  if (!user) return null;

  const submitChecks = async () => {
    setIsLoading(true);
    setFailMessage("");

    const modifiedPrompt = await userPrompt(
      prompt,
      repo.owner,
      repo.repo,
      String(session?.provider_token)
    );

    const target: any = { target: { value: modifiedPrompt } };

    handleInputChange(target);

    const tokensInString = await getTokensFromString(modifiedPrompt);
    const tokenLimit = await getTokenLimit(user.email);
    const isPro = await checkIfPro(user.email);

    if (promptCount > 75 && !isPro) {
      setIsLoading(false);
      setFailMessage(
        "You have reached your prompt limit for today, upgrade or check back tomorrow!"
      );
      return false;
    }

    if (tokensInString > tokenLimit) {
      setIsLoading(false);
      setFailMessage(
        "Your prompt is too long currently to run, try to include less files and more precise information."
      );
      return false;
    }

    return true;
  };

  return (
    <Flex direction="column" w="full" maxW="6xl">
      <Box
        rounded="lg"
        className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
        justifyContent="flex-start"
      >
        <Header />
        <Box className="max-h-[50vh] overflow-y-auto">
          <Input
            className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
            value={prompt}
            placeholder="Describe your business..."
            onChange={(e: any) => {
              setPrompt(e.target.value);
            }}
          />
          <Button
            onClick={async (e: any) => {
              const checks = await submitChecks();
              if (!checks) return null;
              handleSubmit(e);
            }}
          >
            Submit
          </Button>

          {isLoading && !completion ? (
            <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
          ) : (
            <Response content={String(completion)} />
          )}

          {/* {response && (
            <>
              <Response content={String(response)} />
            </>
          )} */}
        </Box>
        <ConversationStyleToggle visible={isFinished} />
        {/* <PromptInput
          promptCount={promptCount}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
          onSubmit={(prompt: any) => submitHandler(prompt)}
        /> */}
        <Text mt={2} fontSize={14}>
          {failMessage}
        </Text>
      </Box>
      <Profile />
    </Flex>
  );
};

export default Chat;
