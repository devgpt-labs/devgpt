import { Box, Image, Text } from "@chakra-ui/react";
import astro from "@/images/astro_profile.png";

const Header = () => {
  return (
    <Box
      justifyContent="space-between"
      borderBottom="1px"
      borderColor="#2D3748"
      pb={3}
      alignItems="center"
    >
      <Box>
        <Text>Choose Your Tech</Text>
      </Box>
      <Image
        src={astro.src}
        alt='Astro says hi!'
        objectFit="contain"
        width="25px"
        height="25px"
      />
    </Box>
  );
};

export default Header;