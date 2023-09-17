import { useEffect, useState } from "react";
import {
  Heading,
  Image,
  Flex,
  Tooltip,
  Box,
  Text,
  Tag,
} from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { supabase } from "@/src/utils/supabase/supabase";
import { useAuthContext } from "@/src/context";

import logo from "@/src/assets/devgpt-4.png";

const Logo = () => {
  const [status, setStatus] = useState("All Operational");
  const { user } = useAuthContext();

  // get data from status table in supabase
  const getStatus = async () => {
    if (!supabase || process?.env?.NEXT_PUBLIC_DEVELOPER_MODE === "true") {
      return;
    }

    const { data, error } = await supabase
      .from("status")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.log(error);
      return;
    }

    setStatus(data.status);
  };

  useEffect(() => {
    getStatus();
  }, []);

  return (
    <Flex
      flexDirection="row"
      mt={4}
      mb={4}
      alignItems="center"
      justifyContent="space-between"
    >
      <Image src={logo.src} height={"40px"} objectFit={"contain"} />
      {/* {user && status !== "All Operational" && !status && (
        <Box width="20">
          <Tooltip label={status}>
            <Tag colorScheme="yellow">
              <Text mr={1}>Status</Text> <AiOutlineInfoCircle color="yellow" />
            </Tag>
          </Tooltip>
        </Box>
      )} */}
    </Flex>
  );
};

export default Logo;
