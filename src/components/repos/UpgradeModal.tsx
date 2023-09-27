import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Link,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

// stores
import authStore from "@/store/Auth";

const UpgradeModal = ({ isUpgradeOpen, onUpgradeClose }: any) => {
  const { user }: any = authStore();

  return (
    <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <Card p="10">
          <ModalCloseButton />
          <CardBody textAlign={"center"}>
            <Stack>
              <Heading size="lg" mb={2}>
                Pro Plan: Early Bird
              </Heading>
              <Text mb={6} fontSize={16}>
                This is our early bird price, it will be available for a limited
                time only. This will also include these benefits in our desktop
                app when it is released.
              </Text>
            </Stack>
            <TableContainer>
              <Table size="md">
                <Thead fontWeight={"bold"}>
                  <Tr>
                    <Th>Feature</Th>
                    <Th>Free</Th>
                    <Th>Pro</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Daily Prompts </Td>
                    <Td>10</Td>
                    <Td>Unlimited</Td>
                  </Tr>
                  <Tr>
                    <Td>AI Model </Td>
                    <Td>GPT-4-8K</Td>
                    <Td>GPT-4-32K</Td>
                  </Tr>
                  <Tr>
                    <Td>Model Training</Td>
                    <Td>5 rounds</Td>
                    <Td>15 rounds</Td>
                  </Tr>
                  <Tr>
                    <Td>Priority Support</Td>
                    <Td>×</Td>
                    <Td>✓</Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </CardBody>
          <CardFooter>
            <Flex
              justifyContent="center"
              alignItems={"center"}
              flex={1}
              flexDirection={"column"}
            >
              <Link
                href={`https://buy.stripe.com/5kA7sB7AMe9xaZ2aFP?client_reference_id=${user?.id}`}
              >
                <Button
                  size="lg"
                  color={"white"}
                  bgGradient={"linear(to-r, blue.500, teal.500)"}
                  _hover={{
                    bgGradient: "linear(to-r, blue.400, teal.400)",
                  }}
                  mb={2}
                >
                  <Text as="s" mr={2} fontSize={14}>
                    {" "}
                    $25.99
                  </Text>{" "}
                  $15.99 /month
                </Button>
              </Link>

              <Text pt={5} textAlign={"center"}>
                Cancel anytime. Billing provided by Stripe.
              </Text>
            </Flex>
          </CardFooter>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default UpgradeModal;
