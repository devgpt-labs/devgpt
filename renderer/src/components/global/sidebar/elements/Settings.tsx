import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  InputGroup,
  InputRightElement,
  TagLabel,
  TagCloseButton,
  Input,
  Button,
  Box,
  Text,
  Flex,
  FormLabel,
  Tag,
  Spinner,
  useToast,
  useDisclosure,
} from "@chakra-ui/react";
import { ipcRenderer, shell } from "electron";
import fs from "fs";
import checkOS from "@/src/utils/checkOS";
import planIntegers from "@/src/config/planIntegers";
import fetchLocalConfigs from "../functions/fetchLocalConfigs";
import countFilesInDirectory from "@/src/utils/countFilesInDirectory";
import { useAuthContext } from "@/src/context";
import TechStack from "@/src/components/global/sidebar/elements/TechStack";
import checkIfPremium from "@/src/utils/checkIfPremium";
import saveRepo from "../functions/saveRepo";
import saveTechStack from "../functions/saveTechStack";
import saveContext from "../functions/saveContext";
import getUserSubscription from "../../functions/getUserSubscription";
import Context from "./Context";
import UpgradeModal from "../../UpgradeModal";
import addRepo from "@/src/utils/addRepo";
import { supabase } from "@/src/utils/supabase/supabase";

const Settings = () => {
  const [localRepoDirectory, setLocalRepoDirectory] = useState("");
  const [technologiesUsed, setTechnologiesUsed] = useState("");
  const [fileTypesToRemove, setFileTypesToRemove] = useState("");
  const [context, setContext] = useState("");

  const [userIsPremium, setUserIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [isCounting, setIsCounting] = useState(false);

  const initialRef = useRef(null);
  const finalRef = useRef(null);
  const { user } = useAuthContext();
  const toast = useToast();

  const setPlan = async () => {
    const premium = await getUserSubscription(user.id);
    if (premium.activeSubscription) {
      setUserIsPremium(true);
    } else {
      setUserIsPremium(false);
    }
  };

  useEffect(() => {
    if (user) {
      setPlan();
    }
  }, []);

  ipcRenderer.on("file-has-been-selected", async (event, result) => {
    if (!result) {
      setIsCounting(false);
      setLoading(false);
      return;
    }
    if (user && result) {
      setLocalRepoDirectory(result);
      setIsCounting(false);
      setLoading(false);
    }
  });

  const SaveAndCancelButtons = ({ onSave }) => {
    return (
      <Flex justifyContent="flex-end" p={4}>
        {!loading && (
          <Flex pl={4}>
            <Button mr={3} onClick={() => {}}>
              Cancel
            </Button>
            <Button
              bgGradient={"linear(to-r, blue.500, teal.500)"}
              onClick={() => {
                onSave();
              }}
            >
              Save
            </Button>
          </Flex>
        )}
      </Flex>
    );
  };

  const RepositoryOptions = () => {
    const {
      isOpen: isUpgradeOpen,
      onOpen: onUpgradeOpen,
      onClose: onUpgradeClose,
    } = useDisclosure();

    return (
      <Box>
        <InputGroup flexDirection="column">
          <Input
            pr="8rem"
            isDisabled={true}
            placeholder={checkOS("Users/me/my-repo", "C:/Users/me/my-repo")}
            value={localRepoDirectory}
            onChange={(e) => {
              setLocalRepoDirectory(e.target.value);
            }}
          />
          <InputRightElement width="8rem">
            <Button
              mr={2}
              size="sm"
              bgGradient={"linear(to-r, blue.500, teal.500)"}
              id="dirs"
              onClick={() => {
                setLoading(true);

                window.postMessage({
                  type: "select-dirs",
                });
              }}
            >
              Select Directory
            </Button>
          </InputRightElement>
        </InputGroup>
        {/* <Flex flexDirection="row" justifyContent="space-between">
          <Flex alignItems={"center"} justifyContent={"flex-end"} mt={3}>
            {userIsPremium ? (
              <Tag
                ml={2}
                bgGradient={"linear(to-r, blue.500, teal.500)"}
                cursor={"pointer"}
                fontWeight={"bold"}
              >
                Premium
              </Tag>
            ) : (
              <Tag
                ml={2}
                bgGradient={"linear(to-r, blue.500, teal.500)"}
                fontWeight={"bold"}
                cursor="pointer"
                onClick={() => {
                  onUpgradeOpen();
                }}
              >
                Upgrade
              </Tag>
            )}
          </Flex>
        </Flex> */}
        <Box p={3} mt={3} borderRadius={3} backgroundColor="gray.600">
          <Text fontSize={14}>
            Your code remains secure. Selecting a directory does
            <Text fontSize={14} as="span" fontWeight={"bold"}>
              {" "}
              not{" "}
            </Text>
            grant us access to your existing code. The chosen repository is used
            to fine-tune the AI model specifically for generating code tailored
            to your project.
          </Text>
        </Box>
        <UpgradeModal
          isUpgradeOpen={isUpgradeOpen}
          onUpgradeClose={onUpgradeClose}
        />
      </Box>
    );
  };

  return (
    <>
      <Box pl={6} pt={6}>
        <Text fontSize="xl" fontWeight={"bold"}>
          {!loading
            ? "Add A Repo to DevGPT"
            : loading
            ? "Loading..."
            : "Select a project directory."}
        </Text>
      </Box>
      {loading ? (
        <Flex flexDirection="row" p={6}>
          <Spinner />
        </Flex>
      ) : (
        <>
          <Box p={6}>
            <RepositoryOptions />
            <TechStack
              technologiesUsed={technologiesUsed}
              setTechnologiesUsed={setTechnologiesUsed}
            />
            <Context context={context} setContext={setContext} />

            <SaveAndCancelButtons
              onSave={() => {
                if (context.length > 3 && technologiesUsed.length > 3) {
                  addRepo(
                    user,
                    technologiesUsed,
                    localRepoDirectory,
                    context,
                    toast
                  );

                  // toast({
                  //   title: "Saved!",
                  //   description:
                  //     "Your local environment settings have been saved.",
                  //   status: "success",
                  //   duration: 6000,
                  //   position: "top-right",
                  //   isClosable: true,
                  // });
                } else {
                  toast({
                    title: "You haven't completed your project settings",
                    description:
                      "Please write your tech stack and what you're currently working on to continue.",
                    status: "error",
                    duration: 6000,
                    position: "top-right",
                    isClosable: true,
                  });
                }
              }}
            />
          </Box>
        </>
      )}
    </>
  );
};

export default Settings;
