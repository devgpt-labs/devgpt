"use client";
import { Text } from "@chakra-ui/react";

const BillingSectionHeader = ({ title, setSection, section }: any) => {
  return (
    <Text
      _hover={{
        borderLeft: "solid 2px",
        borderColor: "blue.200",
      }}
      py={1}
      cursor="pointer"
      borderLeft="2px solid"
      borderColor={section === title ? "blue.800" : "gray.200"}
      pl={3}
      fontSize="sm"
      onClick={() => {
        setSection(title);
      }}
    >
      {title}
    </Text>
  );
};

export default BillingSectionHeader;
