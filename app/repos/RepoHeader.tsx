import { supabase } from "@/utils/supabase";
import { Box, Image, Text } from "@chakra-ui/react";
import astro from "@/images/astro_profile.png";

export const Header = () => {
  return (
    <Box
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="slate.800"
      pb={3}
      alignItems="center"
    >
      <Box>
        <Text>Choose Your Tech</Text>
      </Box>
      <Image
        src={astro.src}
        objectFit="contain"
        width="25px"
        height="25px"
        alt="Astro"
      />
    </Box>
  );
};
