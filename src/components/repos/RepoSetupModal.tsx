import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Text,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

// icons
import { MdScience } from "react-icons/md";
import { TiTick } from "react-icons/ti";

//stores
import authStore from "@/store/Auth";

// components
import Setup from "./Setup";
import calculateTotalCost from "@/utils/calculateTotalCost";

const RepoSetupModal = ({
  isOpen,
  onClose,
  onOpen,
  repo,
  onSubmit,
  estimatedPrice,
}: any) => {
  const router = useRouter();
  const { session, user, monthly_budget }: any = authStore();

  const [sampleSize, setSampleSize] = useState<any>(8);
  const [frequency, setFrequency] = useState<any>(3);
  const [branch, setBranch] = useState<any>("main");
  const [epochs, setEpochs] = useState(1);
  const [trainingMethod, setTrainingMethod] = useState("Embedding");
  const [confirmation, setConfirmation] = useState(false);
  const btnRef: any = useRef();

  useEffect(() => {
    setConfirmation(false);
  }, [isOpen]);

  if (!repo) return null;

  const cost = calculateTotalCost(
    [
      {
        frequency: frequency,
        epochs: epochs,
        sample_size: sampleSize,
      },
    ],
    0
  );

  return (
    <Drawer
      size={"sm"}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerContent>
        <DrawerCloseButton mt={2} />
        <DrawerHeader maxW="90%">AI Model for: {repo.name}</DrawerHeader>
        <DrawerBody>
          <Setup
            branch={branch}
            repo={repo}
            trainingMethod={trainingMethod}
            sampleSize={sampleSize}
            frequency={frequency}
            epochs={epochs}
            setSampleSize={(e: any) => {
              setSampleSize(e);
            }}
            setBranch={(e: any) => {
              setBranch(e);
            }}
            setFrequency={(e: any) => {
              setFrequency(e);
            }}
          />
        </DrawerBody>

        <DrawerFooter>
          <Flex flexDirection="column">
            {monthly_budget < Number(cost) ? (
              <Text fontSize={14}>
                Current training settings exceed your monthly budget. You can change your
                budget in billing. We will block you from training this model
                until you increase your budget incase this is an accident.
              </Text>
            ) : (
              <Flex flexDirection="column" gap={2}>
                <Text fontSize={14}>
                  Training a model does cost, pay attention to the estimated
                  monthly price shown above if you are going to begin training.
                </Text>
              </Flex>
            )}
            <Button
              isDisabled={monthly_budget < Number(cost)}
              mt={2}
              width="100%"
              bgGradient={"linear(to-r, blue.500,teal.500)"}
              color="white"
              onClick={() => {
                if (confirmation) {
                  // Add new model to database
                  onSubmit({
                    ...repo,
                    sampleSize,
                    frequency,
                    epochs,
                    trainingMethod,
                  });

                  // Close the modal
                  onClose();
                  return;
                }

                if (!confirmation) {
                  setConfirmation(true);
                  return;
                }
              }}
            >
              <Text mr={1}>{confirmation ? "Confirm" : "Train"}</Text>
              {confirmation ? <TiTick /> : <MdScience />}
            </Button>
            {monthly_budget < Number(cost) && (
              <Button

                onClick={() => {
                  router.push("/platform/billing")
                }}

                mt={2}>View Billing</Button>

            )}
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RepoSetupModal;
