"use client";
import { useEffect, useState } from "react";
import {
	Box,
	Flex,
	Text,
	SkeletonText,
	Input,
	Button,
	useColorMode,
	SlideFade,
	Kbd,
	Tag,
} from "@chakra-ui/react";
import { useChat } from "ai/react";


//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//prompts
import userPrompt from "@/prompts/user";

//components
import Response from "@/components/Response";
import Profile from "@/components/repos/Profile";
import Training from "@/components/repos/Training";
import { PromptInput } from "./PromptInput";
import { RateConversation } from "./RateConversation";
import { Header } from "./ChatHeader";

//utils
import { savePrompt } from "@/utils/savePrompt";
import getTokensFromString from "@/utils/getTokensFromString";
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import { checkIfPro } from "@/utils/checkIfPro";
import Calculator from "@/components/repos/Calculator";

const Chat = () => {
	const [response, setResponse] = useState<string>("");
	const [previousPrompt, setPreviousPrompt] = useState<string>("");
	const [hasSentAMessage, setHasSentAMessage] = useState<boolean>(true);
	const [isFinished, setIsFinished] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [failMessage, setFailMessage] = useState<string>("");
	const [promptCount, setPromptCount] = useState<number>(0);
	const [prompt, setPrompt] = useState<string>("");

	const { repo, repoWindowOpen, setRepoWindowOpen, lofaf }: any = repoStore();
	const { colorMode } = useColorMode();
	const { user, session }: any = authStore();

	const { messages, input, handleInputChange, handleSubmit } = useChat();

	const submitPrompt = (e: any) => {
		setPreviousPrompt(prompt);
		setHasSentAMessage(true);
		setFailMessage("");
		handleSubmit(e);
	};

	console.log({ messages });

	// This logic breaks down the prompt to find @'d files
	const regex = /@([^ ]+)/g;
	const withAt: any = [];
	let match: any;
	while ((match = regex.exec(prompt))) {
		withAt.push(match[1]);
	}

	// Get the current file being targeted with @
	const selectedFile = lofaf?.filter((file: any) => {
		if (file?.toLowerCase()?.includes(withAt?.[0]?.toLowerCase())) {
			return file;
		}
	});

	// If the user clicks tab, we want to autocomplete the file name
	const handleKeyDown = (file: any) => {
		// Append currentSuggestion to prompt
		const promptArray = prompt.split(" ");

		const lastWord = promptArray[promptArray?.length - 1];
		const newPrompt = prompt.replace(lastWord, `~${file}`);

		setPrompt(newPrompt);
		// Refocus on input
		const input = document.getElementById("message");
		input?.focus();
	};

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

		if (!isPro && promptCount > 16) {
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
		<Flex direction="column" w="full" maxW="6xl" maxH="70vh" my={40}>
			<Box
				rounded="lg"
				className="overflow-hidden p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
				justifyContent="flex-start"
			>
				<Header />
				{messages.map(m => (
					<div key={m.id}>
						{m.role === 'user' ? 'User: ' : 'AI: '}
						{m.content}
					</div>
				))}
				<Box className="max-h-[50vh] overflow-y-auto">
					<Flex flexDirection="column" mt={4}>
						{/* {!repo.repo && (
							<>
								<Button
									width="100%"
									mt={4}
									onClick={() => {
										setRepoWindowOpen(!repoWindowOpen);
									}}
								>
									Select a repo to get started
								</Button>
								<Text fontSize={12} mt={2}>
									{failMessage}
								</Text>
							</>
						)} */}
						{true && (
							<>
								{withAt?.length > 0 && (
									<Flex alignItems={"center"} my={2}>
										<Kbd>Tab</Kbd>
										<Text ml={1}> to accept suggestion</Text>
									</Flex>
								)}
								<Flex flexDirection="row" flexWrap="wrap">
									<SlideFade key={match} in={selectedFile[0] ? true : false}>
										{selectedFile.map((file: any, index: any) => {
											console.log(file);

											if (index > 12) return null;
											return (
												<Tag
													mr={1}
													mb={1}
													key={file}
													cursor="pointer"
													onClick={() => handleKeyDown(file)}
												>
													{file}
												</Tag>
											);
										})}
									</SlideFade>
								</Flex>
								<Flex flexDirection="row">
									<Input
										className="fixed w-full max-w-md bottom-0 border border-gray-300 rounded mb-8 shadow-xl p-2 dark:text-black"
										value={prompt}
										placeholder="Describe your business..."
										onChange={(e: any) => {
											setPrompt(e.target.value);
										}}
										onKeyDown={(e: any) => {
											// If key equals tab, autocomplete
											if (e.key === "Tab") {
												e.preventDefault();
												handleKeyDown(selectedFile[0]);
												return;
											}

											// If key equals enter, submit
											if (e.key === "Enter" && !e.shiftKey) {
												e.preventDefault();
												submitPrompt(e);
												return;
											}
										}}
									/>
									<Button
										bgGradient={"linear(to-r, blue.500, teal.500)"}
										ml={4}
										onClick={async (e: any) => {
											const checks = await submitChecks();
											if (!checks) return null;
											submitPrompt(e);
										}}
									>
										Submit
									</Button>
								</Flex>
							</>
						)}
					</Flex>
					{/* {isLoading && !completion ? (
						<SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
					) : (
						<Response content={String(completion)} />
					)} */}
				</Box>
				{/* {completion && isFinished && (
					<Flex
						width="100%"
						flexDirection="row"
						justifyContent="center"
						alignItems="center"
						mt={2}
					>
						<RateConversation />
						<Text mx={4}>or</Text>
						<Button
							px={4}
							_hover={{
								bg: colorMode === "light" ? "gray.300" : "black",
							}}
							bg={colorMode === "light" ? "white" : "gray.800"}
							alignSelf="center"
							rounded="full"
							onClick={() => {
								setIsFinished(false);
								setIsLoading(false);
								setResponse("");
								setFailMessage("");
							}}
						>
							Start A New Chat
						</Button>
					</Flex>
				)} */}
				<Text mt={2} fontSize={14}>
					{failMessage}
				</Text>{" "}
				<SlideFade in={hasSentAMessage} offsetY="20px">
					<Text mt={5}>{previousPrompt}</Text>
				</SlideFade>
			</Box>
			<Profile />
			<Training />
			{/* <Calculator /> */}
		</Flex>
	);
};

export default Chat;
