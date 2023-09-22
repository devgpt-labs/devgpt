import { Image } from "@chakra-ui/react";
import devgpt from "@/images/devgpt.png";

const Logo = () => {
  return <Image src={devgpt.src} maxH="25px" bg='red' bgClip='text' />;
};

export default Logo;
