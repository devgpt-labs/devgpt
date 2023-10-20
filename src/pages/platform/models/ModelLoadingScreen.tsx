import {
  Flex,
  Box,
  Skeleton,
  Grid,
} from "@chakra-ui/react";

//components
import Template from "@/components/Template";

const ModelLoadingScreen = () => {
  return (
    <Template>
      <Box p={6} width="100vw" height="100vh">
        <Flex width="100%" mb={6} justifyContent="space-between">
          <Skeleton
            bg="gray.700"
            height="35px"
            width="250px"
            borderRadius={10}
          />
          <Flex flexDirection="row" gap={4}>
            <Skeleton
              bg="gray.700"
              height="35px"
              width="150px"
              borderRadius={10}
            />
            <Skeleton
              bg="gray.700"
              height="35px"
              width="150px"
              borderRadius={10}
            />
            <Skeleton
              bg="gray.700"
              height="35px"
              width="150px"
              borderRadius={10}
            />
          </Flex>
        </Flex>
        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={8}
          flexWrap="wrap"
          width="100%"
        >
          <Skeleton bg="gray.700" height="250px" borderRadius={10} />
          <Skeleton bg="gray.700" height="250px" borderRadius={10} />
          <Skeleton bg="gray.700" height="250px" borderRadius={10} />
          <Skeleton bg="gray.700" height="250px" borderRadius={10} />
          <Skeleton bg="gray.700" height="250px" borderRadius={10} />
        </Grid>
      </Box>
    </Template>
  );
}

export default ModelLoadingScreen;
