import { Image } from "@chakra-ui/react";
import devgpt from "@/images/devgpt.png";
import devgptdark from "@/images/devgpt-dark.png";
import { useColorMode } from "@chakra-ui/react";

const Logo = () => {
  const { colorMode } = useColorMode();

  return (
    <Image
      src={colorMode === "dark" ? devgpt.src : devgptdark.src}
      maxH="25px"
      bgClip="text"
    />
  );
};

export default Logo;
