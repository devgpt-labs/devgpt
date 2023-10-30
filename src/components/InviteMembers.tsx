import { useState } from "react";
import {
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Button,
} from "@chakra-ui/react";
import addTeamMember from "@/utils/addTeamMember";

const InviteMembers = ({ team, setTeam }: any) => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<any>("");

  return (
    <>
      <Text mb={2}>Add members to my team</Text>
      <InputGroup size="md" flexDirection="column" mb={1}>
        <Input
          mb={2}
          pr="8rem"
          placeholder="Henry"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Input
          pr="8rem"
          placeholder="henry@myteam.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <InputRightElement width="8rem">
          <Button
            h="1.75rem"
            size="sm"
            onClick={() => addTeamMember(email, name, team, setTeam)}
            color="white"
            bgGradient="linear(to-r, blue.500, teal.500)"
          >
            Send Invite
          </Button>
        </InputRightElement>
      </InputGroup >
      <Text fontSize={14} mb={4}>
        Use the email your teammate uses for their git provider.
      </Text>
    </>
  );
};

export default InviteMembers;
