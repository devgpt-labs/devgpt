"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  SkeletonText,
  Button,
  SlideFade,
  Kbd,
  Tag,
  useDisclosure,
  Link,
  Grid,
  Skeleton,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Badge,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import moment from "moment";
import RepoDrawer from "@/components/repos/RepoDrawer";
import ModelStat from "@/components/ModelStat";
import { getLofaf } from "git-connectors";
import Editor, { DiffEditor } from "@monaco-editor/react";
import TrainingStatus from "@/pages/platform/agent/TrainingStatus";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//prompts
import userPrompt from "@/prompts/user";

//components
import Template from "@/components/Template";
import PromptCorrectionModal from "@/components/PromptCorrectionModal";
import PromptAreaAndButton from "./PromptAreaAndButton";
import Feedback from "@/components/repos/Feedback";

//utils
import getTokenLimit from "@/utils/getTokenLimit";
import getPromptCount from "@/utils/getPromptCount";
import promptCorrection from "@/utils/promptCorrection";
import getModels from "@/utils/getModels";
import getTokensFromString from "@/utils/getTokensFromString";

// Icons
import { AiFillCreditCard } from "react-icons/ai";
import { EmailIcon } from "@chakra-ui/icons";
import { BiConfused } from "react-icons/bi";
import { MdScience } from "react-icons/md";
import { useColorMode } from "@chakra-ui/react";

const Chat = () => {
  // Constants
  const [promptCount, setPromptCount] = useState<number>(0);

  // Sending prompts
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");
  const [failMessage, setFailMessage] = useState<string>("");

  const [messages, setMessages] = useState<any>([]);

  const [response, setResponse] = useState<string>("");

  // Active state
  const [activeModelFilesTrained, setActiveModelFilesTrained] =
    useState<number>(0);
  const [previousPrompt, setPreviousPrompt] = useState<string>("");
  const [correctedPrompt, setCorrectedPrompt] = useState<string>("");
  const [showModelAssessment, setShowModelAssessment] =
    useState<boolean>(false);
  const [hasBeenReset, setHasBeenReset] = useState<boolean>(false);
  const [models, setModels] = useState<any>([]);
  const [showCodeResponse, setShowCodeResponse] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const { colorMode } = useColorMode();
  const {
    repo,
    lofaf,
    setLofaf,
    setRepo,
    repoWindowOpen,
    setRepoWindowOpen,
  }: any = repoStore();
  const {
    user,
    session,
    stripe_customer_id,
    signOut,
    status,
    credits,
    isPro,
  }: any = authStore();

  //   onFinish: (data: any) => {
  //     const inputTokens = getTokensFromString(input);
  //     const responseTokens = getTokensFromString(String(data.content));

  //     const usage = inputTokens + responseTokens;
  //     const cost = calculateTokenCost(usage);

  //     hasBeenReset && setHasBeenReset(false);
  //     setFailMessage("");
  //     setPrompt("");
  //     setLoading(false);
  //     savePrompt(user?.email, prompt, data.content, usage);
  //     setResponse(data.content);
  //     setShowModelAssessment(false);
  //   },

  // const handleSubmit = async (prompt: string) => {
  //   const response = await fetch(
  //     "https://devgpt-api-production-f45a.up.railway.app/generate",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         task: prompt,
  //         repo: "toms-private-sand-pit",
  //         owner: "tom-lewis-code",
  //       }),
  //     }
  //   )
  //     .then((res) => res.json())
  //     .catch((err) => console.log(err));
  // };

  useEffect(() => {
    // Get all models
    getModels(
      (data: any) => {
        setModels(data);
      },
      () => { },
      user?.email
    );

    // Get the users last used repo
    const lastUsedRepo = Cookies.get("recentlyUsedRepoKey");
    if (lastUsedRepo) {
      const lastUsedRepoObject = JSON.parse(lastUsedRepo);
      setRepo(lastUsedRepoObject);
    }

    if (!session?.provider_token) {
      signOut();
      router.push("/", undefined, { shallow: true });
      console.log("no session found, returning to home");
    }

    if (!user) {
      signOut();
      router.push("/", undefined, { shallow: true });
      console.log("no user found, returning to home");
    }

    console.log(
      "Helpful debugging information, if all of these are true, it's probably working fine.:",
      {
        "User is pro": isPro,
        "User email": user?.email,
        "Valid Repo": !!lofaf,
        "Valid Stripe": !!stripe_customer_id,
        "Valid GitHub": !!session?.provider_token,
      }
    );
  }, []);

  const result = {
    success: true,
    generatedFiles: [
      {
        fileName: "src/App.js",
        originalContent:
          'import logo from \'./logo.svg\';\nimport \'./App.css\';\n\nfunction App() {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <img src={logo} className="App-logo" alt="logo" />\n        <p>\n          Edit <code>src/App.js</code> and save to reload.\n        </p>\n        <a\n          className="App-link"\n          href="https://reactjs.org"\n          target="_blank"\n          rel="noopener noreferrer"\n        >\n          Learn React\n        </a>\n      </header>\n    </div>\n  );\n}\n\nexport default App;\n',
        newContent:
          'import logo from \'./logo.svg\';\nimport \'./App.css\';\n\nfunction App({surname}) {\n  return (\n    <div className="App">\n      <header className="App-header">\n        <img src={logo} className="App-logo" alt="logo" />\n        <p>\n          Edit <code>src/App.js</code> and save to reload.\n        </p>\n        <p>\n          Surname: {surname}\n        </p>\n        <a\n          className="App-link"\n          href="https://reactjs.org"\n          target="_blank"\n          rel="noopener noreferrer"\n        >\n          Learn React\n        </a>\n      </header>\n    </div>\n  );\n}\n\nexport default App;',
        tasksCompletedPreviously:
          "Added a 'surname' prop to the App function and displayed it in a new paragraph element in the return statement of the function.",
        similarFile: {
          fileName: "src/Mushroom.js",
          content:
            "import logo from \"./logo.svg\";\nimport \"./App.css\";\n\nfunction App() {\nreturn (\n<div className='App'>\n<header className='App-header'>\n<img src={logo} className='App-logo' alt='logo' />\n<p>\nEdit <code>src/App.js</code> and save to reload.\n</p>\n<a\nclassName='App-link'\nhref='https://reactjs.org'\ntarget='_blank'\nrel='noopener noreferrer'\n>\nMushroom\n</a>\n</header>\n</div>\n);\n}\n\nexport default App;\n",
        },
      },
      {
        fileName: "src/App.test.js",
        originalContent:
          "import { render, screen } from '@testing-library/react';\nimport App from './App';\n\ntest('renders learn react link', () => {\n  render(<App />);\n  const linkElement = screen.getByText(/learn react/i);\n  expect(linkElement).toBeInTheDocument();\n});\n",
        newContent:
          "import { render, screen } from '@testing-library/react';\nimport App from './App';\n\ntest('renders learn react link', () => {\n  render(<App surname='Doe' />);\n  const linkElement = screen.getByText(/learn react/i);\n  const surnameElement = screen.getByText(/Doe/i);\n  expect(linkElement).toBeInTheDocument();\n  expect(surnameElement).toBeInTheDocument();\n});",
        tasksCompletedPreviously:
          "Added a 'surname' prop to the App component in the render function of the test. Also added a new line to check if the surname is in the document.",
        similarFile: {
          fileName: "src/setupTests.js",
          content:
            "// jest-dom adds custom jest matchers for asserting on DOM nodes.\n// allows you to do things like:\n// expect(element).toHaveTextContent(/react/i)\n// learn more: https://github.com/testing-library/jest-dom\nimport '@testing-library/jest-dom';\n",
        },
      },
      {
        fileName: "src/Profile.js",
        originalContent: null,
        newContent:
          "import React from 'react';\n\nfunction Profile({surname}) {\nreturn (\n<div className='Profile'>\n<p>{surname}</p>\n</div>\n);\n}\n\nexport default Profile;",
        tasksCompletedPreviously:
          "Created a new React functional component named 'Profile'. This component accepts a 'surname' prop and displays it in a paragraph element.",
        similarFile: {
          fileName: "src/Mushroom.js",
          content:
            "import logo from \"./logo.svg\";\nimport \"./App.css\";\n\nfunction App() {\nreturn (\n<div className='App'>\n<header className='App-header'>\n<img src={logo} className='App-logo' alt='logo' />\n<p>\nEdit <code>src/App.js</code> and save to reload.\n</p>\n<a\nclassName='App-link'\nhref='https://reactjs.org'\ntarget='_blank'\nrel='noopener noreferrer'\n>\nMushroom\n</a>\n</header>\n</div>\n);\n}\n\nexport default App;\n",
        },
      },
      {
        fileName: "src/Profile.test.js",
        originalContent: null,
        newContent:
          "import React from 'react';\n\nfunction Profile({ surname }) {\n  return (\n    <div>\n      <p>{surname}</p>\n    </div>\n  );\n}\n\nexport default Profile;",
        tasksCompletedPreviously:
          "Created a new React functional component named 'Profile'. This component accepts a 'surname' prop and displays it in a paragraph element.",
        similarFile: {
          fileName: "src/setupTests.js",
          content:
            "// jest-dom adds custom jest matchers for asserting on DOM nodes.\n// allows you to do things like:\n// expect(element).toHaveTextContent(/react/i)\n// learn more: https://github.com/testing-library/jest-dom\nimport '@testing-library/jest-dom';\n",
        },
      },
    ],
  };

  const handleGetLofaf = async (repo: any, session: any) => {
    await getLofaf(repo.owner, repo.repo, session?.provider_token).then(
      (data: any) => {
        if (!data) return;

        // Convert data from csv to array of strings
        const files = data.split(",");

        // Set lofaf to the files found
        setLofaf(files);
      }
    );
  };

  useEffect(() => {
    handleGetLofaf(repo, session);
  }, [repo]);

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

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
  const handleUseTabSuggestion = (file: any) => {
    if (!file) {
      setFailMessage(`Couldn't find a file containing ${withAt?.[0]}`);
      return null;
    }
    // Append currentSuggestion to prompt
    const promptArray = prompt.split(" ");
    const lastWord = promptArray[promptArray?.length - 1];
    const newPrompt = prompt.replace(lastWord, `~/${file}`);

    // Set prompts
    setPrompt(newPrompt);
    setFailMessage("");

    // Refocus on input
    const input = document.getElementById("message");
    input?.focus();
  };

  const submitChecks = async (
    ignoreFeedback: boolean,
    useOriginalPrompt?: boolean
  ) => {
    setLoading(true);
    setFailMessage("");
    setPreviousPrompt(prompt);

    let promptFeedback;

    if (!ignoreFeedback) {
      promptFeedback = await promptCorrection(user?.email, prompt, lofaf, {
        stripe_customer_id: stripe_customer_id,
      });

      if (promptFeedback?.changes) {
        //display promptCorrection modal
        setPrompt(promptFeedback?.correctedPrompt);
        onOpen();
        return false;
      }
    }

    const newPrompt =
      ignoreFeedback && !useOriginalPrompt ? correctedPrompt || prompt : prompt;

    let target: any = {
      target: { value: newPrompt },
    };

    setPrompt(target);
    setPreviousPrompt(newPrompt);

    const modifiedPrompt = await userPrompt(
      newPrompt,
      repo.owner,
      repo.repo,
      String(session?.provider_token)
    );

    target = { target: { value: modifiedPrompt } };
    setPrompt(target);

    const tokensInString = await getTokensFromString(modifiedPrompt);
    const tokenLimit = getTokenLimit();

    if (tokensInString > tokenLimit) {
      setLoading(false);
      setFailMessage(
        "Your prompt is too long currently to run, try to include less files and more precise information."
      );
      return false;
    }
    return true;
  };

  const model = models?.find((model: any) => model?.repo === repo?.repo);

  if (!isPro) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="80%"
          height="70vh"
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
          <Skeleton
            bg="gray.700"
            height="40px"
            width="85%"
            mb={4}
            borderRadius={10}
          />
          <Skeleton
            bg="gray.700"
            height="40px"
            width="15%"
            mb={4}
            borderRadius={10}
          />
        </Flex>
      </Template>
    );
  }

  if (status?.isBanned) {
    return (
      <Template>
        <Flex
          alignItems="center"
          justifyContent="center"
          mt={5}
          h="70vh"
          w="100vw"
        >
          <BiConfused />
          <Text ml={3}>
            Oops, something went wrong! Please get in touch with the team via
            Discord.
          </Text>
        </Flex>
      </Template>
    );
  }

  if (!user) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="80%"
          height="70vh"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Skeleton
            bg="gray.700"
            height="40px"
            width="85%"
            mb={4}
            borderRadius={10}
          />
          <Skeleton
            bg="gray.700"
            height="40px"
            width="15%"
            mb={4}
            borderRadius={10}
          />
        </Flex>
      </Template>
    );
  }

  return (
    <Template>
      <RepoDrawer />

      <Flex
        direction="column"
        flex={1}
        w="80%"
        maxW="full"
        justifyContent={"center"}
        p={5}
      >
        <Box
          rounded="lg"
          className="p-5 flex flex-col border border-blue-800/40 shadow-2xl shadow-blue-900/30"
          justifyContent="flex-start"
        >
          {!repo.repo && (
            <Box>
              <Button
                width="100%"
                bgGradient="linear(to-r, blue.500, teal.500)"
                color="white"
                mt={4}
                onClick={() => {
                  setRepoWindowOpen(!repoWindowOpen);
                }}
              >
                <MdScience />
                <Text ml={1}>Select a model to get started</Text>
              </Button>
              <Text fontSize={12} mt={2}>
                {failMessage}
              </Text>
            </Box>
          )}
          {repo.repo && (
            <Box>
              {!isPro && (
                <Flex flexDirection="column" mt={4}>
                  <Text>
                    Before you continue prompting, we need to get your billing
                    in order!
                  </Text>
                  <Text mb={3} fontSize={14} color="gray.600">
                    You can continue using DevGPT and prompting with your
                    trained models immediately after this.
                  </Text>
                  <Flex flexDirection="row" gap={2}>
                    <Button
                      width="100%"
                      bgGradient={"linear(to-r, blue.500, teal.500)"}
                      color="white"
                      onClick={() => {
                        router.push("/platform/billing");
                      }}
                    >
                      <Text mr={2}>View Billing</Text>
                      <AiFillCreditCard />
                    </Button>
                    <Link href="mailto:support@devgpt.com">
                      <Button>
                        <Text mr={2}>Email Support</Text>
                        <EmailIcon />
                      </Button>
                    </Link>
                  </Flex>
                </Flex>
              )}

              <TrainingStatus />

              {withAt?.length > 0 && (
                <Flex alignItems={"center"} my={2}>
                  <Kbd>Tab</Kbd>
                  <Text ml={1}> to accept suggestion</Text>
                </Flex>
              )}
              <Flex flexDirection="row" flexWrap="wrap" mb={2}>
                <SlideFade key={match} in={selectedFile?.[0] ? true : false}>
                  {selectedFile?.map((file: any, index: any) => {
                    if (index > 12) return null;
                    return (
                      <Tag
                        mr={1}
                        mb={1}
                        key={file}
                        cursor="pointer"
                        onClick={() => handleUseTabSuggestion(file)}
                      >
                        {file}
                      </Tag>
                    );
                  })}
                </SlideFade>
              </Flex>

              <PromptAreaAndButton
                prompt={prompt}
                selectedFile={selectedFile}
                loading={loading}
                setLoading={setLoading}
                handleUseTabSuggestion={handleUseTabSuggestion}
                setPrompt={setPrompt}
                submitChecks={submitChecks}
                setHasBeenReset={setHasBeenReset}
                handleSubmit={(prompt: any) => handleSubmit(prompt)}
              />

              {failMessage && (
                <Text mb={2} mt={2} fontSize={14}>
                  {failMessage}
                </Text>
              )}

              {previousPrompt && (
                <SlideFade in={!!previousPrompt}>
                  <Heading mt={2} mb={4} size="md">
                    {previousPrompt}
                  </Heading>
                </SlideFade>
              )}

              {loading ? (
                <SkeletonText
                  mt={4}
                  mb={4}
                  noOfLines={4}
                  spacing={4}
                  skeletonHeight="2"
                />
              ) : (
                <Box mt={2}>
                  {result.generatedFiles.map((file: any) => {
                    return (
                      <Box>
                        <Flex flexDirection="row" alignItems="center" gap={2}>
                          {file.originalContent ? (
                            <Badge>EDITED</Badge>
                          ) : (
                            <Badge>NEW</Badge>
                          )}

                          <Text fontSize="sm" color="gray.400">
                            {file.fileName}
                          </Text>
                        </Flex>

                        <Text fontSize={14} mt={1}>
                          {file.tasksCompletedPreviously
                            ? file.tasksCompletedPreviously
                            : ""}
                        </Text>

                        <Box borderRadius={10} mt={2} mb={4} overflow="hidden">
                          {file.originalContent ? (
                            <DiffEditor
                              theme="vs-dark"
                              language="javascript"
                              original={file.originalContent}
                              modified={file.newContent}
                              options={{
                                scrollBeyondLastLine: false,
                                padding: {
                                  top: 20,
                                  bottom: 0,
                                },
                                renderWhitespace: "none",
                              }}
                              height="300px"
                              className="editor"
                            />
                          ) : (
                            <Editor
                              value={file.newContent}
                              theme="vs-dark"
                              language="javascript"
                              options={{
                                scrollBeyondLastLine: false,
                                padding: {
                                  top: 20,
                                  bottom: 0,
                                },
                                renderWhitespace: "none",
                              }}
                              height="300px"
                              className="editor"
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}

              {/* <Box mt={4}>
                <Flex
                  flexDirection="row"
                  gap={2}
                  alignItems="center"
                  justifyContent="flex-start"
                >
                  <Flex flexDirection="row" alignItems="center">
                    <FaBrain />
                    <Text ml={1} mr={2}>
                      Model Empirical Assessment
                    </Text>
                    <Switch
                      id="isChecked"
                      isChecked={showModelAssessment}
                      onChange={() =>
                        setShowModelAssessment(!showModelAssessment)
                      }
                    />
                  </Flex>
                </Flex>
              </Box> */}

              {showModelAssessment && (
                <>
                  <Text
                    fontSize="sm"
                    mb={3}
                    color={colorMode === "light" ? "#CBD5E0" : "gray"}
                  >
                    Hover over each one to learn more.
                  </Text>
                  <Grid templateColumns="repeat(3, 1fr)" gap={6}>
                    <ModelStat
                      label="Training Size Target"
                      number={model?.sample_size > 0 ? model?.sample_size : 0}
                      tip={moment(Date.now()).format("MMMM Do YYYY")}
                      tooltip="This is the number of files you've selected for training your model. It serves as an initial target for how many files should be trained. You are only charged for the actual files that were successfully trained."
                    />
                    <ModelStat
                      label="Actual Sample Size"
                      number={
                        activeModelFilesTrained > 0
                          ? activeModelFilesTrained
                          : 0
                      }
                      tip={moment(Date.now()).format("MMMM Do YYYY")}
                      tooltip="This is the actual number of files that were used to train your model. This number may be less than the 'Training Size Target' due to file validation, large file size or filtering. You are only charged for the actual files that were successfully trained."
                    />
                    <ModelStat
                      label="Training Accuracy"
                      number={`${(
                        (activeModelFilesTrained / model?.sample_size) *
                        100
                      ).toFixed(2)}%`}
                      tip={
                        (activeModelFilesTrained / model?.sample_size) * 100 <
                          60
                          ? "Below 60% accuracy, we recommend retraining"
                          : moment(Date.now()).format("MMMM Do YYYY")
                      }
                      tooltip="This represents the accuracy of your trained model based on the files used for training. A higher accuracy indicates better performance, but remember, real-world scenarios might vary. Use this as an initial metric to gauge your model's effectiveness."
                    />
                  </Grid>
                </>
              )}
            </Box>
          )}
        </Box>

        <Feedback
          models={models}
          response={response}
          handleRegenerate={() => {
            handleSubmit(prompt);
            setLoading(true);
          }}
          handleNew={() => {
            setHasBeenReset(true);
            setLoading(false);
            setFailMessage("");
          }}
        />

        <PromptCorrectionModal
          correctedPrompt={correctedPrompt}
          prompt={previousPrompt}
          setPrompt={setPrompt}
          isOpen={isOpen}
          onClose={onClose}
          onSubmit={async (prompt: any) => {
            // Run checks
            const checks = await submitChecks(true, false);
            if (!checks) return null;

            // Show that we haven't reset
            setHasBeenReset(false);

            // Submit to useChat
            handleSubmit(prompt);
          }}
          setLoading={setLoading}
        />
      </Flex>
    </Template>
  );
};

export default Chat;
