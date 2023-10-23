"use client";
import {
  Text,
  Heading,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";

//utils
import calculateTotalCost from "@/utils/calculateTotalCost";

const calculateStatSum = (stat: string, modelsInTraining: any) => {
  return modelsInTraining.length > 0 ? (
    <>
      {modelsInTraining
        .map((model: any) => model?.[stat])
        .reduce((a: any, b: any) => a + b, 0)}
    </>
  ) : (
    0
  );
};

const BillingTable = ({ modelsInTraining, budget, budgetEstimation }: any) => {
  return (
    <>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th isNumeric>Epochs</Th>
              <Th isNumeric>Sample_Size</Th>
              <Th isNumeric>Frequency</Th>
              {/* <Th isNumeric>Cost</Th> */}
            </Tr>
          </Thead>
          <Tbody>
            {modelsInTraining.length > 0 ? (
              <>
                {modelsInTraining.map((model: any) => {
                  return (
                    <>
                      <Tr>
                        <Td>{model.repo}</Td>
                        <Td isNumeric>{model.epochs}</Td>
                        <Td isNumeric>{model.sample_size}</Td>
                        <Td isNumeric>{model.frequency}</Td>
                        {/* <Td isNumeric>${calculateTotalCost([model], 0)}</Td> */}
                      </Tr>
                    </>
                  );
                })}
              </>
            ) : (
              <Text my={4}>No models have been trained yet.</Text>
            )}
          </Tbody>
          <Tfoot>
            <Tr>
              <Th>Total</Th>
              <Th isNumeric>{calculateStatSum("epochs", modelsInTraining)}</Th>
              <Th isNumeric>
                {calculateStatSum("sample_size", modelsInTraining)}
              </Th>
              <Th isNumeric>
                {calculateStatSum("frequency", modelsInTraining)}
              </Th>
              {/* <Th isNumeric>${calculateTotalCost(modelsInTraining, 0)}</Th> */}
            </Tr>
            <Tr>
              {/* <Th>Estimated monthly cost</Th>
              <Th isNumeric></Th>
              <Th isNumeric></Th>
              <Th isNumeric></Th>
              <Th isNumeric>
                <Heading>
                  $
                  {budget < budgetEstimation
                    ? budget
                    : budgetEstimation.toFixed(2)}
                </Heading>
              </Th> */}
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </>
  );
};

export default BillingTable;
