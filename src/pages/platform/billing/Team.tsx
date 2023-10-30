import { Text, Tr, Th, TableCaption, Table, Tbody, Td, TableContainer, Thead } from "@chakra-ui/react";

const Team = ({ team }: any) => {
  if (!team) return null;

  console.log(team);

  return (
    <>
      <Text>Team members</Text>
      <TableContainer>
        <Table variant="striped">
          <TableCaption>
            Team Members will show here after they have been invited.
          </TableCaption>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Invited By</Th>
              <Th>Status</Th>
              {/* <Th>Cancel</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {team.members.map((member: any) => {
              return (
                <Tr>
                  <Td>{member.name}</Td>
                  <Td>{member.email}</Td>
                  <Td>Accepted</Td>
                  {/* <Td>
                    <IconButton
                      aria-label="Cancel"
                      icon={<MdCancel />}
                      onClick={() => { 
                      }}
                      mr={4}
                    />
                  </Td> */}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Team;