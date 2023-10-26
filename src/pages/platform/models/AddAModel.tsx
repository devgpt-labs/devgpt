import {
  Flex,
  Box,
  Skeleton,
  Grid,
  Text,
  Button,
  Link,
  IconButton,
  Heading,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { SmallAddIcon } from "@chakra-ui/icons";
import repoStore from "@/store/Repos";
import RepoDrawer from "@/components/repos/RepoDrawer";
import Router from "next/router";

//components
import Template from "@/components/Template";
import { BiRefresh } from "react-icons/bi";

const AddAModel = ({ setRefresh, refresh }: any) => {
  const { repoWindowOpen, setRepoWindowOpen }: any = repoStore();
  const router = Router;

  return (
    <Template>
      <Flex p={4} flexDirection="column" gap={2} width="100%" height="100%">
        <Flex
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Flex flexDirection="row" alignItems='center'>
            <Link href="/platform/agent">
              <IconButton
                onClick={() => {
                  router.back();
                }}
                aria-label="Close"
                icon={<ArrowBackIcon />}
              />
            </Link>
            <Heading size="md" ml={4}>
              Train Your First Model
            </Heading>
          </Flex>
          <Button
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <BiRefresh />
            <Text ml={2}>Refresh</Text>
          </Button>
        </Flex>
        <RepoDrawer setRefresh={setRefresh} refresh={refresh} />
        <Flex
          width="100%"
          height="50vh"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text mb={2}>No models found yet</Text>
          <Button
            onClick={() => {
              setRepoWindowOpen(!repoWindowOpen);
            }}
            rightIcon={<SmallAddIcon />}
          >
            Train A New Model
          </Button>
        </Flex>
      </Flex>
    </Template>
  );
};

export default AddAModel;
