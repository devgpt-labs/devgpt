import { Avatar } from "@chakra-ui/react";

import { useAuthContext } from "@/src/context";

const UserAvatar = () => {
  const { user } = useAuthContext();

  return (
    <Avatar
      bgGradient="linear(to-r, blue.500, teal.500)"
      color="white"
      mr={4}
      fontWeight={"bold"}
      name={user?.email}
      height='40px'
      width='40px'
    />
  );
};

export default UserAvatar;
