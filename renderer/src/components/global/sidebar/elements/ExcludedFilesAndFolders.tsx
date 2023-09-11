import React, { useEffect, useState } from "react";
import {
  InputGroup,
  InputRightElement,
  TagLabel,
  TagCloseButton,
  Input,
  Button,
  FormLabel,
  Tag,
  Text,
  Flex,
  useToast,
} from "@chakra-ui/react";

const ExcludedFilesAndFolders = ({
  fileTypesToRemove,
  setFileTypesToRemove,
}: any) => {
  const [tagToAdd, setTagToAdd] = useState("");
  const [showAllTags, setShowAllTags] = useState(false);
  const toast = useToast();

  const addTag = () => {
    setFileTypesToRemove(fileTypesToRemove + "," + tagToAdd);
    setTagToAdd("");

    toast({
      title: "Added file type",
      description: "Added " + tagToAdd + " to the list of excluded files.",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  return (
    <>
      <FormLabel color="white" mt={3}></FormLabel>
      {/* <Flex mt={2} mb={2} flexDirection="column" alignItems="flex-start">
        <Text fontSize={18} color="white" mr={2}>
          Exclude files from training
        </Text>
        <Text fontSize={14} mr={2} mt={2} color="gray.400">
          Ignore specific files and folders during repository fine-tuning. Add
          bulk folders like node_modules, requirements.txt, etc. here.
        </Text>
      </Flex> */}
      {/* <InputGroup flexDirection="column">
        <Input
          pr="11rem"
          placeholder="E.g. .png, .jpg, /node_modules/"
          value={tagToAdd}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              addTag();
            }
          }}
          onChange={(e) => {
            // Add to the end of the list with a comma
            setTagToAdd(e.target.value);
          }}
        />
        <InputRightElement width="11rem">
          <Button
            mr={2}
            h="1.75rem"
            size="sm"
            onClick={() => {
              addTag();
            }}
          >
            Add
          </Button>
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => {
              setFileTypesToRemove(
                ".jpg,.png,.svg,.jpeg,.gif,.pdf,.env,.lock,package-lock.json,yarn.lock,build,dist,out,.git,.svn,.hg,.bzr,.vscode,.idea,.DS_Store,npm-debug.log,yarn-error.log,bin,obj,venv,.venv,.pyc,pkg,vendor,.android,build.gradle,local.properties,.tmp,.log,.bak,.ipynb_checkpoints,.o,.build,.swiftpm,.kotlin_built,node_modules"
              );
            }}
          >
            Set Defaults
          </Button>
        </InputRightElement>
      </InputGroup> */}
      {/* {fileTypesToRemove.split(",").map((file: any, index: any) => {
        if (!file || file === " ") return null;
        // Only show the first 5 tags
        if (!showAllTags && index > 3) return null;
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
            // On click, remove this file from the list
            onClick={() => {
              if (fileTypesToRemove.includes(file + ",")) {
                setFileTypesToRemove(fileTypesToRemove.replace(file + ",", ""));
              }
            }}
          >
            <TagLabel>{file}</TagLabel>
            <TagCloseButton />
          </Tag>
        );
      })} */}
      {/* {fileTypesToRemove.length > 3 && (
        <Tag
          onClick={() => {
            setShowAllTags(!showAllTags);
          }}
          cursor="pointer"
          size="sm"
          mt={2}
          px={3}
          mr={1}
          alignSelf="flex-start"
          borderRadius="full"
          variant="outline"
        >
          {showAllTags ? "Show less" : "Show all"}
        </Tag>
      )} */}
    </>
  );
};

export default ExcludedFilesAndFolders;
