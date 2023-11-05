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
  Link,
  Skeleton,
  Heading,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Editor, { DiffEditor } from "@monaco-editor/react";

import { ChevronDownIcon } from "@chakra-ui/icons";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

//components
import Template from "@/components/Template";
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

const Branch = () => {
  // Constants
  const [promptCount, setPromptCount] = useState<number>(0);

  // Sending prompts
  const [loading, setLoading] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  // Active state
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

  const handleSubmit = async (prompt: string) => {
    const response = await fetch(
      "https://devgpt-api-production-f45a.up.railway.app/generate",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: prompt,
          repo: "toms-private-sand-pit",
          owner: "tom-lewis-code",
        }),
      }
    )
      .then((res) => res.json())
      .catch((err) => console.log(err));
  };

  useEffect(() => {
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
  }, []);

  const result = {
    success: true,
    branchName: "[QOL] Include OG Meta tags for sharing URLs #233",
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

  useEffect(() => {
    if (promptCount != 0) return;
    getPromptCount(user?.email, setPromptCount);
  }, [user?.email]);

  if (isPro === false) {
    return (
      <Template>
        <Flex
          flexDirection="row"
          width="98%"
          height="70vh"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          <Modal isOpen={true} onClose={() => {}} isCentered={true}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Start Your 7-day Free Trial</ModalHeader>
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
                <Text ml={1}>Select a repo to get started</Text>
              </Button>
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

              <SlideFade in={!!result.branchName}>
                <Heading mt={2} mb={4} size="lg">
                  {result.branchName}
                </Heading>
              </SlideFade>
              <Flex justifyContent={"flex-end"}>
                <Menu>
                  <MenuButton
                    as={Button}
                    rightIcon={<ChevronDownIcon />}
                    bgColor="#2da042"
                  >
                    Review Changes
                  </MenuButton>
                  <MenuList>
                    <MenuItem>Raise PR</MenuItem>
                    <MenuItem>Close Branch</MenuItem>
                  </MenuList>
                </Menu>
              </Flex>
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
            </Box>
          )}
        </Box>
      </Flex>
    </Template>
  );
};

export default Branch;
