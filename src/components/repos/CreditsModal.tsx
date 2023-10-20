import { useEffect, useState } from "react";

import {
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  Input,
  ModalCloseButton,
  ModalBody,
  InputGroup,
  ModalHeader,
  ModalFooter,
  Button,
  Flex,
  InputRightElement,
  Link,
  Image,
  SlideFade,
} from "@chakra-ui/react";
import { supabase } from "@/utils/supabase";
import Stripe from "stripe";

// stores
import authStore from "@/store/Auth";
import Cookies from "js-cookie";

const CreditsModal = ({
  isCreditsOpen,
  onCreditsOpen,
  onCreditsClose,
}: any) => {
  const { user, setCredits, credits }: any = authStore();
  const [packets, setPackets] = useState<any>(1);
  const [show, setShow] = useState(false);

  const token = process?.env?.NEXT_PUBLIC_STRIPE_KEY
    ? process?.env?.NEXT_PUBLIC_STRIPE_KEY
    : "notoken";

  const handleChange = (e: any) => {
    if (e.target.value < 5) return;
    setPackets(e.target.value);
  };

  const add = () => {
    setPackets(packets + 1);
  };

  const subtract = () => {
    if (packets <= 1) return;
    setPackets(packets - 1);
  };

  const handleStripe = async () => {
    const stripe = new Stripe(token, {
      apiVersion: "2023-08-16",
    });

    const session: any = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [{
        price_data: {
          unit_amount: packets * 500,
          currency: "usd",
          product: "prod_OkOhxC7ZVg3xMP",
        },
        quantity: 1,
      }],
      success_url: "https://devgpt.com",
      cancel_url: "https://devgpt.com",
    });

    // Open the session in a new tab

    if (!session) return
    window.open(session?.url, "_blank");
  }

  const addCredits = async () => {
    if (!supabase) return;
    // open link 

    const newCredits = credits + packets * 115;

    const { data, error } = await supabase
      .from("customers")
      .update({ credits: newCredits })
      .eq("email_address", user.email);

    if (error) {
      console.log(error);
      return null
    }

    onCreditsClose();
  };

  const submitToStripe = async () => {
    addCredits();
    handleStripe()
  };

  const identity = user?.identities?.find((identity: { provider: string }) =>
    ["github", "gitlab", "bitbucket", "mock"].includes(identity?.provider)
  )?.identity_data;

  return (
    <Modal isCentered={true} isOpen={isCreditsOpen} onClose={onCreditsClose}>
      <ModalOverlay />
      <ModalContent p={4}>
        <ModalCloseButton />
        <Text>Add Credits</Text>
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <Image
            width={50}
            height={50}
            rounded="full"
            src={identity?.avatar_url}
          />
          {/* <Text>{credits + packets * 115} Credits</Text> */}
        </Flex>

        {/* <Text fontSize={14} my={2} color="gray.400">
          Your key is stored locally on your machine. We do not store your key
          or save it to our database.
        </Text> */}
        <Flex
          mt={2}
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text>${packets * 5}</Text>
          <Flex mt={2} gap={2} flexDirection="row">
            {/* <SlideFade key={packets} in={packets > 1}>
              <Text fontSize={14} color="gray.400">
                {packets} packets
              </Text>
            </SlideFade> */}
            <SlideFade key={packets} in={packets > 1}>
              <Text padding={3} cursor="pointer" onClick={subtract}>
                -
              </Text>
            </SlideFade>
            <Input
              type="number"
              onChange={handleChange}
              value={packets}
              alignSelf="center"
              textAlign="center"
            />
            <Text padding={3} cursor="pointer" onClick={add}>
              +
            </Text>
          </Flex>
          {/* <Text fontSize={14} color="gray.400" mr={10}>
            If you don't have or don't want to use your Open-AI key, you can
          upgrade to use our key.
        </Text>
        <Button mr={2}>Upgrade</Button> */}
        </Flex>
        <Flex flexDirection="row" gap={2} mt={4}>
          <Button onClick={onCreditsClose}>Cancel</Button>
          {/* <Link href='https://buy.stripe.com/5kA0094oAaXl7MQ5lw'> */}
          <Button width="100%" onClick={submitToStripe}>
            Add
          </Button>
          {/* </Link> */}
        </Flex>
      </ModalContent>
    </Modal>
  );
};

export default CreditsModal;
