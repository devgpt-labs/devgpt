import { Text, Flex } from "@chakra-ui/react";

//stores
import repoStore from "@/store/Repos";

//components
import Logo from "@/components/Logo";

export const Header = () => {
  const { repo }: any = repoStore();
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
