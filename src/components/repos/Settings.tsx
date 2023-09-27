"use client";
import { Box, Input, VStack, Text } from "@chakra-ui/react";

//stores
import repoStore from "@/store/Repos";
import authStore from "@/store/Auth";

const Repos = () => {
  const { branch, setBranch }: any = repoStore();
  const { user }: any = authStore();

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
              setBranch(e?.value);
            }}
            border="0.5px solid #2D3748"
          />
          <Text fontSize={12}>
            {
              "This will default to your default branch. Don't worry about writing 'main' or 'master' in here."
            }
          </Text>
        </VStack>
      </Box>
    </>
  );
};

export default Repos;
