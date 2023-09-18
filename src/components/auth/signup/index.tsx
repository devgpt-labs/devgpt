import React, { useState, useEffect } from "react";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Card,
  Button,
  Stack,
  Link,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Image,
  Spinner,
  InputGroup,
  InputRightElement,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";

import router from "next/router";
import Logo from "../../global/Logo";
import { supabase } from "@/src/utils/supabase/supabase";
import { decideUserHomeScreen } from "@/src/utils/decideUserHomeScreen";
import { useAuthContext } from "@/src/context";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast();
  const { user } = useAuthContext();

  useEffect(() => {
    if (user) {
      decideUserHomeScreen(user);
    }
  }, []);

  const handleSignUpWithPassword = async () => {
    setLoading(true);
    //validate inputs
    if (email === "" || password === "") {
      toast({
        position: "top-right",
        title: "Please enter an email and password",
        status: "error",
        isClosable: true,
      });
      //setLoading(false);
      return;
    }

    if (!supabase) {
      toast({
        position: "top-right",
        title: "Error",
        description: "Database is not initialized",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      toast({
        position: "top-right",
        title: "Error",
        description: error.message,
        status: "error",
        isClosable: true,
      });
      setLoading(false);
      return;
    }

    if (data) {
      const user = data.user;

      toast({
        position: "top-right",
        title: "Success",
        description: "Account created",
        status: "success",
        isClosable: true,
      });
      setLoading(false);

      //sign this user in
      await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      decideUserHomeScreen(user);
      return;
    }
  };

  return (
    <Flex
      justifyContent={"center"}
      alignItems={"center"}
      flex={1}
      h={"100vh"}
      bgGradient={"linear(to-r, blue.500, teal.500)"}
    >
      <Card
        p={10}
        pt={5}
        pb={5}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        maxW={"lg"}
      >
        <Logo />
        <Heading size="xl" color="white" mt={5}>
          Create an account
        </Heading>
        <Text color="white" mt={5}>
          Already have an account?{" "}
          <Link
            color="blue.400"
            onClick={() => {
              router.push("/login");
            }}
          >
            Sign in
          </Link>
        </Text>
        <Flex
          alignItems={"flex-start"}
          flex={1}
          minW="md"
          flexDirection={"column"}
        >
          <FormLabel color="white" mt={5}>
            Email
          </FormLabel>
          <Input
            autoFocus
            type="email"
            placeholder="Email"
            color="white"
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormLabel color="white" mt={5}>
            Password
          </FormLabel>
          <InputGroup>
            <Input
              onKeyDown={(e) => {
                // If key is enter, log user in
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSignUpWithPassword();
                }
              }}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              pr="4.5rem"
              type={show ? "text" : "password"}
              placeholder={show ? "Enter password" : "•••••••••••"}
            />
            <InputRightElement width="4.5rem">
              <Button
                h="1.75rem"
                size="sm"
                onClick={() => {
                  setShow(!show);
                }}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
        <Text color="white" mt={5}>
          By signing up, you agree to our{" "}
          <Link
            color="blue.400"
            onClick={() => {
              console.log("https://www.devgpt.com/ip-policy"); //todo swap to link
            }}
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            color="blue.400"
            onClick={() => {
              console.log("https://www.devgpt.com/ip-policy"); //todo swap to link
            }}
          >
            Privacy Policy
          </Link>
        </Text>
        {loading ? (
          <Button
            bgGradient={"linear(to-r, blue.500, teal.500)"}
            mt={8}
            minW="200"
          >
            <Spinner color="white" />
          </Button>
        ) : (
          <Button
            bgGradient={"linear(to-r, blue.500, teal.500)"}
            mt={8}
            minW="200"
            onClick={handleSignUpWithPassword}
          >
            Sign up & login
          </Button>
        )}
      </Card>
    </Flex>
  );
}
