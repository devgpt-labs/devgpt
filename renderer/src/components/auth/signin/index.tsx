import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Button,
  Stack,
  Link,
  Text,
  useToast,
  Image,
  Spinner,
  InputGroup,
  InputRightElement,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "../../../context";
import { supabase } from "@/src/utils/supabaseClient"
import { decideUserHomeScreen } from "@/src/utils/decideUserHomeScreen";
import { IoPauseCircleOutline, IoPlayCircleOutline } from "react-icons/io5";
import Logo from "@/src/components/global/Logo";
import audios from "@/src/config/audios";
import ResetMyPasswordButton from "./ResetMyPasswordButton";
import Typewriter from "typewriter-effect";

export default function Auth() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicLink, setMagicLink] = useState(false);
  const [show, setShow] = useState(false);
  const [userIsRegistering, setUserIsRegistering] = useState(true);
  const router = useRouter();
  const { user, session } = useAuthContext();

  const handleClick = () => setShow(!show);

  // Listen for the enter key, and if it's pressed, submit the form
  useEffect(() => {
    const handleEnter = (e: any) => {
      if (e.key === "Enter") {
        handleSignIn();
      }
    };

    window.addEventListener("keydown", handleEnter);

    return () => {
      window.removeEventListener("keydown", handleEnter);
    };
  }, [email, password]);

  //check if user is already signed in
  useEffect(() => {
    if (user) {
      decideUserHomeScreen(user);
    }
  }, [user]);

  const handleSignIn = async () => {
    setLoading(true);
    //validate inputs
    if (email === "" || password === "") {
      toast({
        position: "top-right",
        title: "Please enter your email",
        status: "error",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (!supabase) {
      setLoading(false);
      return;
    } else {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        toast({
          position: "top-right",
          title: error?.message,
          status: "error",
          isClosable: true,
        });
        setLoading(false);
        return
      }

      if (user?.aud === "authenticated") {
        decideUserHomeScreen(user);
      }
    }
  };

  return (
    <Flex
      alignItems="flex-start"
      alignSelf="center"
      flexDirection="row"
      width="100vw"
      overflowY="hidden"
    >
      <Flex
        height="85vh"
        flexDirection="column"
        alignItems="center"
        flex={0.2}
        px={10}
        mt={20}
      >
        <Logo />
        <Stack spacing={8} mx={"auto"} maxW={"xl"}>
          <Stack alignItems={"flex-start"}>
            <Text fontSize={"2xl"} mt={6}>
              Sign In
            </Text>
            {!userIsRegistering ? (
              <Text fontSize={"md"} color={"gray.600"}>
                Already have an account?{" "}
                <Link
                  color={"blue.100"}
                  onClick={() => {
                    setUserIsRegistering(!userIsRegistering);
                  }}
                >
                  Sign in
                </Link>
                ✌️
              </Text>
            ) : (
              <Text fontSize={"md"} color={"gray.400"}>
                {"Don't have an account? "}
                <Link
                  color={"blue.400"}
                  onClick={() => {
                    router.push("/signup");
                  }}
                >
                  Sign up here
                </Link>{" "}
              </Text>
            )}
          </Stack>
          <Box rounded={"lg"} boxShadow={"lg"}>
            {loading ? (
              <Flex
                direction="column"
                justifyContent="center"
                alignItems="center"
              >
                <Spinner alignSelf="center" />
              </Flex>
            ) : (
              <>
                {magicLink ? (
                  <Stack spacing={4} my={6}>
                    <FormControl id="email">
                      <FormLabel>Email address</FormLabel>
                      <Input
                        type="email"
                        value={email}
                        required={true}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </FormControl>
                    <Stack spacing={6}>
                      <Stack
                        direction={{ base: "column", sm: "row" }}
                        alignItems={"start"}
                        justifyContent={"space-between"}
                      >
                        <Link
                          color={"blue.400"}
                          onClick={() => {
                            setMagicLink(!magicLink);
                          }}
                        >
                          Sign in with password
                        </Link>
                      </Stack>
                    </Stack>
                  </Stack>
                ) : (
                  <Stack spacing={4}>
                    <FormControl id="email">
                      <FormLabel fontSize={12}>EMAIL</FormLabel>
                      <Input
                        autoFocus
                        placeholder="me@devgpt.com"
                        type="email"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        value={email}
                      />
                    </FormControl>
                    <FormControl id="password">
                      <FormLabel fontSize={12}>PASSWORD</FormLabel>
                      <InputGroup>
                        <Input
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                          pr="4.5rem"
                          type={show ? "text" : "password"}
                          placeholder={show ? "Enter password" : "•••••••••••"}
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm" onClick={handleClick}>
                            {show ? "Hide" : "Show"}
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <ResetMyPasswordButton />
                    </FormControl>
                    <Stack spacing={10}>
                      <Stack
                        direction={{ base: "column", sm: "column" }}
                        alignItems={"start"}
                        justifyContent={"space-between"}
                      >
                        <Checkbox>Stay signed in</Checkbox>
                      </Stack>
                      <Button
                        bg={"blue.400"}
                        color={"white"}
                        _hover={{
                          bg: "blue.500",
                        }}
                        onClick={handleSignIn}
                      >
                        Sign in
                      </Button>
                    </Stack>
                  </Stack>
                )}
              </>
            )}
          </Box>
        </Stack>
      </Flex>
      <Flex
        fontSize={35}
        pl={35}
        pt={20}
        alignItems="flex-start"
        justifyContent="flex-start"
        flexDirection="column"
        height="100vh"
        flex={0.8}
        bgGradient={"linear(to-r, blue.500, teal.500)"}
      >
        <Typewriter
          options={{
            autoStart: true,
            loop: true,
            delay: 15,
            deleteSpeed: 15,
          }}
          onInit={(typewriter) => {
            typewriter
              .typeString(
                "<strong>Write unit tests</strong> for a Python script using Pytest"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Fix a bug in a <strong>Ruby on Rails controller</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Create a new feature using <strong>Swift</strong> in an iOS app"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Improve error handling in a <strong>Java</strong> command-line application"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Optimize <strong>SQL queries</strong> in a PostgreSQL database"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Design a unique <strong>CSS layout</strong> for a personal blog (HTML/CSS)"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Refactor a small <strong>PHP script</strong> for better performance"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Add <strong>pagination</strong> to a Django web application"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Review and merge pull requests for a <strong>Flask API</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Update dependencies in a <strong>Node.js application</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Implement responsive styles for a <strong>React Native</strong> mobile app"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Write API documentation for endpoints in an <strong>Express.js server</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Research and integrate a <strong>Python library</strong> for data visualization"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Create and execute <strong>SQL scripts</strong> for data transformation"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Add input validation to a simple <strong>HTML form</strong> (JavaScript)"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Conduct code review for a colleague's <strong>Python script</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Implement a basic caching mechanism in a <strong>PHP application</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Design and develop a <strong>RESTful API</strong> in Go"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Write integration tests for a small <strong>Kotlin module</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Optimize images and assets for a <strong>WordPress website</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Refine user interface details based on feedback (<strong>UI/UX</strong>)"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Set up automated tests for a <strong>Python command-line tool</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Implement <strong>internationalization (i18n)</strong> in a multilingual app"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Create and schedule a <strong>Python cron job</strong> for data backup"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Write technical documentation for a <strong>Ruby gem</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Implement a basic notification system using <strong>Firebase Cloud Messaging (FCM)</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Create interactive animations using <strong>CSS</strong> and <strong>SVG</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Perform security testing on a <strong>PHP web application</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Build a simple web app using <strong>Flask (Python)</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Troubleshoot cross-browser issues for a <strong>Vue.js component</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Implement user authentication in a <strong>Django REST API</strong>"
              )
              .pauseFor(400)
              .deleteAll()
              .typeString(
                "Design and implement a basic <strong>SQLite database schema</strong>"
              )
              .start();
          }}
        />
      </Flex>
    </Flex>
  );
}
