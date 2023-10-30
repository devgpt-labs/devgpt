import { Text } from "@chakra-ui/react";

const BillingSectionHeader = ({
  name,
  disabled,
  setSection,
  section,
}: any) => {

  return (
    <Text
      _hover={{
        borderLeft: "solid 2px",
        borderColor: "blue.200",
      }}
      color={disabled ? "GrayText" : 'Text'}
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
