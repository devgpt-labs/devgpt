import React, { useState } from "react";
import {
  Flex,
  Box,
  FormControl,
  Input,
  Button,
  Stack,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { supabase } from "@/src/utils/supabase/supabase";

const UpdatePassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const router = useRouter();
  const toast = useToast();

  const handleUpdatePassword = async () => {
    //validate inputs
    if (email === "" || password === "" || confirmPassword === "") {
      toast({
        position: "top-right",
        title: "Please enter a valid email",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        position: "top-right",
        title: "Passwords do not match",
        status: "error",
        isClosable: true,
      });
      return;
    }

    if (!supabase) {
      return;
    } else {
      if (password === confirmPassword) {
        const { error } = await supabase.auth.updateUser({
          email: email,
          password: password,
        });
        if (error) {
          toast({
            position: "top-right",
            title: "Error updating password",
            status: "error",
            isClosable: true,
          });
        } else {
          toast({
            position: "top-right",
            title: "Password updated",
            status: "success",
            isClosable: true,
          });
          router.push("/platform/profile");
        }
      }
    }
  };

  return (
    <Flex alignItems={"center"} justifyContent={"center"}>
      <Stack spacing={8} mx={"auto"} maxW={"2xl"} py={12} px={6}>
        <Box rounded={"lg"} boxShadow={"lg"} p={8}>
          <Heading textAlign={"center"} fontSize={"4xl"} mb={10}>
            Hey, don{"'"}t worry, we all forget our passwords sometimes
          </Heading>

          <Stack spacing={4}>
            <FormControl id="update-password-form">
              <Input
                type="email"
                value={email}
                required={true}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                mb={4}
              />
              <Input
                type="password"
                value={password}
                required={true}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                mb={4}
              />
              <Input
                type="password"
                value={confirmPassword}
                required={true}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>
            <Stack spacing={6}>
              <Button
                bgGradient={"linear(to-r, blue.500, teal.500)"}
                onClick={handleUpdatePassword}
              >
                Update Password
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};

export default UpdatePassword;
