import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Flex,
  Heading,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { shell } from "electron";
import { useAuthContext } from "@/src/context";
import planIntegers from "@/src/config/planIntegers";

const UpgradeModal = ({ isUpgradeOpen, onUpgradeClose }: any) => {
  const { user } = useAuthContext();

  const Plan = () => {
    return (
      <Card bg="gray.800" p="10">
        <CardBody textAlign={"center"}>
          <Stack>
            <Heading size="lg" mb={2}>
              Pro Plan - Early bird
            </Heading>
            <Text mb={6} fontSize={"18"}>
              This is our early bird price, it will be available for a limited
              time only.
            </Text>
          </Stack>
          <TableContainer overflowX="hidden">
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
                  <Td>Daily lines of code </Td>
                  <Td>{planIntegers.free_lines_of_code_count}</Td>
                  <Td>Unlimited</Td>
                </Tr>
                <Tr>
                  <Td>Priority support</Td>
                  <Td>✕</Td>
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
            <Button
              size="lg"
              bgGradient={"linear(to-r, blue.500, teal.500)"}
              _hover={{
                bgGradient: "linear(to-r, blue.400, teal.400)",
              }}
              onClick={() => {
                shell.openExternal(
                  `https://buy.stripe.com/5kA7sB7AMe9xaZ2aFP?client_reference_id=${user?.id}`
                );
              }}
              mb={2}
            >
              <Text as="s" mr={2} fontSize={15}>
                {" "}
                $25.99
              </Text>{" "}
              $15.99 /month
            </Button>
            <Text pt={5} textAlign={"center"}>
              Cancel anytime. Billing provided by Stripe.
            </Text>
          </Flex>
        </CardFooter>
      </Card>
    );
  };
  return (
    <Modal
      size="lg"
      isCentered={true}
      isOpen={isUpgradeOpen}
      onClose={onUpgradeClose}
    >
      <ModalOverlay backdropFilter="blur(10px)" />
      <ModalContent>
        <ModalCloseButton />
        <Plan />
      </ModalContent>
    </Modal>
  );
};

export default UpgradeModal;
