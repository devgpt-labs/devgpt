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
import { supabase } from "../../../utils/supabase/supabase";
import { decideUserHomeScreen } from "@/src/utils/decideUserHomeScreen";
import { IoPauseCircleOutline, IoPlayCircleOutline } from "react-icons/io5";
import Logo from "@/src/components/global/Logo";
import audios from "@/src/config/audios";
import Typewriter from "typewriter-effect";

const ResetMyPasswordButton = () => {
    const toast = useToast();

    const {
        isOpen: isResetPasswordOpen,
        onOpen: onResetPasswordOpen,
        onClose: onResetPasswordClose,
    } = useDisclosure();

    const [emailForPasswordReset, setEmailForPasswordReset] = useState("");

    return (
        <>
            <Text
                cursor="pointer"
                color="grey"
                textDecoration="underline"
                fontSize={14}
                mt={2}
                onClick={onResetPasswordOpen}
            >
                Forgot Password
            </Text>

            <Modal
                isCentered={true}
                isOpen={isResetPasswordOpen}
                onClose={onResetPasswordClose}
            >
                <ModalOverlay />
                <ModalContent p={4}>
                    <Text fontSize={20} mb={2}>
                        Reset Password
                    </Text>
                    <ModalCloseButton />
                    <Text color="gray.300">
                        Enter your email, and we will send you a magic link for you to gain
                        access to your account. You will be able to reset your password from
                        inside your account.
                    </Text>
                    <Input
                        autoFocus
                        onChange={(e) => {
                            setEmailForPasswordReset(e.target.value);
                        }}
                        value={emailForPasswordReset}
                        my={4}
                        placeholder="my@email.com"
                    />

                    <Button
                        onClick={async () => {
                            const { error } = await supabase.auth.signInWithOtp({
                                email: emailForPasswordReset,
                            });

                            if (error) {
                                toast({
                                    title: "Error",
                                    description: error.message,
                                    status: "error",
                                    duration: 5000,
                                    isClosable: true,
                                });
                            }

                            toast({
                                title: "Please check your email",
                                description:
                                    "We've sent you a link for you to get into your account",
                                position: "top-right",
                                status: "success",
                                duration: 5000,
                                isClosable: true,
                            });

                            onResetPasswordClose();
                        }}
                        alignSelf="flex-end"
                    >
                        Send
                    </Button>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ResetMyPasswordButton;
