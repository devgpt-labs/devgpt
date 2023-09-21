import { supabase } from "@/utils/supabase";
import { Box, Flex, Image, Tag, Text } from "@chakra-ui/react";
import AstroHead from "@/images/astro_profile.png";

//components
import Logo from "@/app/components/Logo";

export const Header = () => {
  return (
    <Flex
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="slate.600"
      pb={3}
      alignItems="center"
    >
      <Logo />
      <Tag
        p={2}
        colorScheme="blue"
        justifyContent="center"
        position="absolute"
        top={0}
        left={0}
        width="100vw"
        flexDirection="row"
      >
        <Text mr={3}>We are now a web based AI dev-agent. </Text>
        <Text mr={3}>🎉 </Text>
        <Text>GitLab and BitBucket connectors coming soon.</Text>
        {/* <Text>Read more about why we thought this was important</Text> */}
      </Tag>
      <Image
        src={AstroHead.src}
        objectFit="contain"
        width="25px"
        height="25px"
        alt="DevGPT Astro"
      />
    </Flex>
  );
};
