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
  Box,
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
import planIntegers from "@/configs/planIntegers";
import { useRouter } from "next/router";

// stores
import authStore from "@/store/Auth";

const UpgradeModal = ({ isUpgradeOpen, onUpgradeClose }: any) => {
  const { user }: any = authStore();
  const router = useRouter();

  return (
    <Modal isOpen={isUpgradeOpen} onClose={onUpgradeClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <Card p="10">
          <ModalCloseButton />
          <CardBody textAlign={"center"}>
            <Stack>
              <Heading size="lg" mb={2}>
                DevGPT Plans
              </Heading>
              <Text mb={6} fontSize={16}>
                More detail below.
              </Text>
            </Stack>
            <TableContainer>
              <Table size="md">
                <Thead fontWeight={"bold"}>
                  <Tr>
                    <Th>Feature</Th>
                    <Th>{planIntegers.pro.name}</Th>
                    <Th>{planIntegers.team.name}</Th>
                    <Th>{planIntegers.enterprise.name}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  <Tr>
                    <Td>Trained Models </Td>
                    <Td>{planIntegers.pro.models}</Td>
                    <Td>{planIntegers.team.models}</Td>
                    <Td>∞</Td>
                  </Tr>
                  <Tr>
                    <Td>Training Rounds (up to)</Td>
                    <Td>{planIntegers.pro.training_rounds}</Td>
                    <Td>{planIntegers.team.training_rounds}</Td>
                    <Td>{planIntegers.enterprise.training_rounds}</Td>
                  </Tr>
                  <Tr>
                    <Td>Team Seats</Td>
                    <Td>{planIntegers.pro.team_members}</Td>
                    <Td>{planIntegers.team.team_members}</Td>
                    <Td>∞</Td>
                  </Tr>
                  <Tr>
                    <Td>Private Instance</Td>
                    <Td>×</Td>
                    <Td>✓</Td>
                    <Td>✓</Td>
                  </Tr>
                  <Tr>
                    <Td>Price</Td>
                    <Td>{planIntegers.pro.price}</Td>
                    <Td>{planIntegers.team.price}</Td>
                    <Td>Contact</Td>
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
                onClick={() => {
                  router.push("/platform/billing", undefined, {
                    shallow: true,
                  });
                }}
                size="lg"
                color={"white"}
                bgGradient={"linear(to-r, blue.500, teal.500)"}
                _hover={{
                  bgGradient: "linear(to-r, blue.500, teal.500)",
                }}
                mb={2}
              >
                <Text >
                  Learn More
                </Text>{" "}
              </Button>

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
