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
      borderColor="slate.800"
      pb={3}
      alignItems="center"
    >
      <Logo />
      <Text>{repo.repo}</Text>
      <Image
        pos="absolute"
        top={5}
        left={5}
        src={astro.src}
        width="25px"
        height="25px"
        alt="Astro"
      />
    </Flex>
  );
};
