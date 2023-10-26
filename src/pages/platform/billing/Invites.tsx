import {
  Text,
  Tr,
  Th,
  TableCaption,
  Table,
  Tbody,
  Td,
  TableContainer,
  Thead,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import handleTeamInvite from "@/utils/handleTeamInvite";

const Invites = ({ user, team, invites, setTeam, setInvites }: any) => {
  // If no team, return null
  if (!team) return null;

  // If no invites, return null
  if (!invites) return null;
  if (invites.length === 0) return null;

  // If the invite is accepted: true, return null
  if (invites.find((invite: any) => invite.accepted === true)) return null;

  // If the invite id is not the same as the team id, return null
  if (
    !invites.find((invite: any) => {
      return invite.team === team.id;
    })
  )
    return null;

  return (
    <>
      <Text>Invites</Text>
      <TableContainer>
        <Table variant="striped">
          <TableCaption>All invites will show here</TableCaption>
          <Thead>
            <Tr>
              <Th>Team</Th>
              <Th>Invited By</Th>
              <Th>Choice</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{team.name}</Td>
              <Td>{team.owner}</Td>
              <Td>
                <Tooltip label="Accept">
                  <IconButton
                    mr={2}
                    onClick={() => {
                      handleTeamInvite(
                        user.email,
                        "accept",
                        team,
                        invites,
                        setTeam,
                        setInvites
                      );
                    }}
                    aria-label="Accept"
                    colorScheme="green"
                    icon={<AiFillLike />}
                  />
                </Tooltip>
                <Tooltip label="Reject">
                  <IconButton
                    onClick={() => {
                      handleTeamInvite(
                        user.email,
                        "deny",
                        team,
                        invites,
                        setTeam,
                        setInvites
                      );
                    }}
                    aria-label="Reject"
                    colorScheme="red"
                    icon={<AiFillDislike />}
                  />
                </Tooltip>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Invites;
