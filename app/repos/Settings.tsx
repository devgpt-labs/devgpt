"use client";
import { useState } from "react";
import { Header } from "./RepoHeader";
import { supabase } from "@/utils/supabase";
import {
    Box,
    Divider,
    Input,
    VStack,
    Text,
    InputGroup,
    InputLeftElement,
    Tag,
    Button,
} from "@chakra-ui/react";
import { useSessionContext } from "@/context/useSessionContext";
import TechStack from "./TechStack";

const Repos = () => {
    const { user, methods, context, branch, repo } = useSessionContext();
    // const [contextInput, setContextInput] = useState<string>("");
    // const [techStackInput, setTechStackInput] = useState<string>("");

    if (!user) return null;

    return (
        <>
            <Box mt={6} mb={2}>
                <VStack spacing={2} mt={2} alignItems="flex-start">
                    <Text>Branch Name</Text>
                    <Input
                        value={branch}
                        placeholder="my-branch"
                        onChange={(e: any) => {
                            // After the user has stopped typing for 5 seconds, update the branch
                            methods.setBranch(e?.value);
                        }}
                        border="0.5px solid #2D3748"
                    />
                    <Text fontSize={12}>{"This will default to your default branch. Don't worry about writing 'main' or 'master' in here."}</Text>
                    {/* <Button onClick={onSave}>Save</Button> */}
                    {/* <TechStack />
                    <Text>Context</Text>
                    <Input
                        value={contextInput}
                        placeholder="What are you trying to do? E.g. Create a new Next.js booking app"
                        onChange={(e: any) => {
                            methods.setContext(e?.value);
                            setContextInput(e?.value);
                        }}
                        border="0.5px solid #2D3748"
                    /> */}
                </VStack>
            </Box>
        </>
    );
};

export default Repos;
