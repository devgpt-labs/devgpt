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
import planIntegers from "@/configs/planIntegers";

const RepoSetupModal = ({
  isOpen,
  onClose,
  onOpen,
  repo,
  onSubmit,
  estimatedPrice,
}: any) => {
  const router = useRouter();
  const { session, user, monthly_budget, isPro }: any = authStore();

  const [sampleSize, setSampleSize] = useState<any>(null);
  const [frequency, setFrequency] = useState<any>(1);
  const [branch, setBranch] = useState<any>("main");
  const [epochs, setEpochs] = useState(1);
  const [trainingMethod, setTrainingMethod] = useState("Embedding");
  const [confirmation, setConfirmation] = useState(false);
  const btnRef: any = useRef();

  useEffect(() => {
    setConfirmation(false);

    switch (isPro) {
      case "individual":
        setSampleSize(planIntegers.individual.sample_size)
        break;
      case "business":
        setSampleSize(planIntegers.business.sample_size)
        break;
      case "member":
        setSampleSize(planIntegers.business.sample_size)
        break;
      case "enterprise":
        setSampleSize(planIntegers.enterprise.sample_size)
        break;
    }
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

  if (sampleSize === null) return null;

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
                router.push("/platform/billing");
              }}
              mt={2}
            >
              View Billing
            </Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RepoSetupModal;
