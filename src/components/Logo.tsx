import { Image } from "@chakra-ui/react";
import devgpt from "@/assets/devgpt.png";
import devgptdark from "@/assets/devgpt-dark.png";
import { useColorMode } from "@chakra-ui/react";

const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === "dark" ? devgpt.src : devgptdark.src}
      maxH="25px"
      bgClip="text"
      alt="Astro says hi!"
    />
  );
};

export default Logo;
