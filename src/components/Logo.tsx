import { Image, Tooltip } from "@chakra-ui/react";
import devgpt from "@/assets/devgpt.png";
import devgptdark from "@/assets/devgpt-dark.png";
import { useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";

const Logo = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();

  return (
    <Image
      cursor="pointer"
      onClick={() => {
        router.push("/platform/agent", undefined, {
          shallow: true,
        });
      }}
      src={colorMode === "dark" ? devgpt.src : devgptdark.src}
      maxH="23px"
      bgClip="text"
      alt="DevGPT Logo"
    />
  );
};

export default Logo;
