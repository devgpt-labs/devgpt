import { Box, Text, Flex, Image } from "@chakra-ui/react";
import { useSessionContext } from "@/context/useSessionContext";
import astro from "@/images/astro_profile.png";

//components
import Logo from "@/app/components/Logo";

export const Header = () => {
  const { repo } = useSessionContext();
  return (
    <Flex
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="#2D3748"
      pb={3}
      alignItems="center"
    >
      <Logo />
      <Text>{repo.repo}</Text>
    </Flex>
  );
};
