import React, { useState } from "react";
import {
  InputGroup,
  TagLabel,
  TagCloseButton,
  Input,
  FormLabel,
  Tag,
  Button,
  InputRightElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text,
  Flex,
  Grid,
  useToast,
  Tooltip,
} from "@chakra-ui/react";
import technologies from "./technologies";
import { IoInformationCircleOutline } from "react-icons/io5";

const TechStack = ({ technologiesUsed, setTechnologiesUsed, onSave }: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [tagToAdd, setTagToAdd] = useState("");
  const toast = useToast();

  const TechOption = ({ label, Icon, onClick }: any) => {
    return (
      <Button onClick={onClick} flexWrap="wrap">
        <Text fontSize={12} mr={2}>
          {label}
        </Text>
        <Icon />
      </Button>
    );
  };

  const setTechnology = ({ tech }: any) => {
    setTechnologiesUsed(technologiesUsed + "," + tech);
    onClose();
  };

  const addTag = () => {
    setTechnologiesUsed(technologiesUsed + "," + tagToAdd);
    setTagToAdd("");

    // toast.closeAll()
    // toast({
    //   title: "Added Tech",
    //   description: "Added " + tagToAdd + " to your tech stack.",
    //   status: "success",
    //   duration: 3000,
    //   isClosable: true,
    //   position: "top-right",
    // });
  };

  return (
    <>
      <Modal size="xl" isCentered={true} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>What are you using?</ModalHeader>
          <ModalCloseButton />
          <Grid
            templateColumns="repeat(3, 1fr)"
            gap={4}
            mx={6}
            mb={6}
            flexDirection="row"
          >
            {technologies.map((tech: any, index: any) => {
              return (
                <TechOption
                  key={index}
                  label={tech.label}
                  Icon={tech.Icon}
                  onClick={() => setTechnology({ tech: tech.tech })}
                />
              );
            })}
          </Grid>
        </ModalContent>
      </Modal>
      <Flex mt={2} mb={2} flexDirection="column" alignItems="flex-start">
        <Text fontSize={18} color="white" mr={2}>
          Which Languages and Frameworks are you using?
        </Text>
        {/* <IoInformationCircleOutline /> */}
        <Text fontSize={14} mr={2} mt={2} color="gray.400">
          Entering your project's languages and frameworks helps us generate
          higher-quality, more relevant code tailored to your tech stack.
        </Text>
      </Flex>
      <InputGroup flexDirection="column">
        <Input
          autoFocus
          pr="11rem"
          placeholder="E.g. TypeScript, Go, Stripe, React, Chakra UI."
          value={tagToAdd}
          onChange={(e) => {
            setTagToAdd(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === ",") {
              e.preventDefault();
              addTag();
            }

            if (e.key === "Enter") {
              // onSave();
              addTag();
            }
          }}
        />
        <InputRightElement width="11rem">
          <Button
            mr={2}
            h="1.75rem"
            size="sm"
            onClick={() => {
              // onSave();
              addTag();
            }}
          >
            Add
          </Button>
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => {
              onOpen();
            }}
          >
            Set Defaults
          </Button>
        </InputRightElement>
      </InputGroup>
      {technologiesUsed.split(",").map((tech: any, index: any) => {
        if (!tech || tech === " ") return null;
        return (
          <Tag
            cursor="pointer"
            size="sm"
            mt={2}
            mr={1}
            key={index}
            alignSelf="flex-start"
            borderRadius="full"
            bg="gray.600"
            onClick={() => {
              // Remove the tech from the string and accompanying comma unless there isn't a comma
              if (technologiesUsed.includes(tech + ",")) {
                setTechnologiesUsed(technologiesUsed.replace(tech + ",", ""));
              } else {
                setTechnologiesUsed(technologiesUsed.replace(tech, ""));
              }
            }}
          >
            <TagLabel>{tech}</TagLabel>
            <TagCloseButton />
          </Tag>
        );
      })}
    </>
  );
};

export default TechStack;
