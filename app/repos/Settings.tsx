"use client";
import { useState } from "react";
import { Header } from "./RepoHeader";
import {
    Box,
    Divider,
    Input,
    VStack,
    Text,
    InputGroup,
    InputLeftElement,
    Tag
} from "@chakra-ui/react";
import { useSessionContext } from "@/context/useSessionContext";
import TechStack from "./TechStack";


const Repos = () => {
    const { user, methods, context, techStack, branch } = useSessionContext();

    if (!user) return null;

    return (
        <>
            <Box mt={6} mb={2}>
                <VStack spacing={2} mt={2} alignItems="flex-start">
                    <Text>Branch Name</Text>
                    <Input
                        value={branch}
                        placeholder="main"
                        onChange={(e: any) => {
                            methods.setBranch(e?.value);
                        }}
                        border="0.5px solid gray"
                    />
                    <TechStack />

                    <Text>Context</Text>
                    <Input
                        value={context}
                        placeholder="What are you trying to do? E.g. Create a new Next.js booking app"
                        onChange={(e: any) => {
                            methods.setContext(e?.value);
                        }}
                        border="0.5px solid gray"
                    />
                </VStack>
            </Box>
        </>
    );
};

export default Repos;
