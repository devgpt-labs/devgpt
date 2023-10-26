"use client";
import { Text } from "@chakra-ui/react";

const BillingSectionHeader = ({
  name,
  disabled,
  setSection,
  section,
}: any) => {

  console.log({ section });
  console.log({ name });


  return (
    <Text
      _hover={{
        borderLeft: "solid 2px",
        borderColor: "blue.200",
      }}
      color={disabled ? "gray.400" : "gray.900"}
      py={1}
      cursor="pointer"
      borderLeft="2px solid"
      borderColor={name === section.name ? "blue.800" : "gray.200"}
      pl={3}
      fontSize="sm"
      onClick={() => {
        if (disabled) return;

        setSection({
          name: name,
          disabled: disabled,
        });
      }}
    >
      {name}
    </Text>
  );
};

export default BillingSectionHeader;
