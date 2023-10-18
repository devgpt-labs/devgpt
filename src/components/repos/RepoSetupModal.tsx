import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Text,
  Flex,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

// icons
import { MdScience } from "react-icons/md";
import { GiTick } from "react-icons/gi";
import { TiTick } from "react-icons/ti";

//stores
import useStore from "@/store/Auth";

// utils
import trainModels from "@/utils/trainModels";

// components
import Setup from "./Setup";

const RepoSetupModal = ({ isOpen, onClose, onOpen, repo, onSubmit }: any) => {
  const { user, session }: any = useStore();

  const [sampleSize, setSampleSize] = useState(8);
  const [frequency, setFrequency] = useState(3);
  const [branch, setBranch] = useState("main");
  const [epochs, setEpochs] = useState(1);
  const [trainingMethod, setTrainingMethod] = useState("Embedding");
  const [confirmation, setConfirmation] = useState(false);
  const btnRef: any = useRef();

  useEffect(() => {
    setConfirmation(false);
  }, [isOpen]);

  if (!repo) return null;

  return (
    <Drawer
      size={"sm"}
      isOpen={isOpen}
      placement="right"
      onClose={onClose}
      finalFocusRef={btnRef}
    >
      <DrawerContent>
        <DrawerCloseButton />
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
          <Flex flexDirection="column" width="100%">
            <Flex flexDirection="row">
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button
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

                    // Begin model training
                    trainModels(session, user);

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
            </Flex>
            <Text fontSize={14} mt={1} alignSelf="flex-end" textAlign="right">
              Training a model does cost, pay attention to the estimated monthly
              price shown above.
            </Text>
          </Flex>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RepoSetupModal;
