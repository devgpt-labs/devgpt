import {
    Flex,
    Stat,
    StatHelpText,
    StatLabel,
    StatNumber,
    Tooltip,
    useColorMode,
} from "@chakra-ui/react";
import { RiInformationFill } from "react-icons/ri";

const ModelStat = ({ label, number, tip, tooltip }: any) => {
    const { colorMode } = useColorMode();

    return (
        <Stat
            border={colorMode === "light" ? "1px solid #CBD5E0" : "1px solid #1a202c"}
            p={4}
            borderRadius={10}
        >
            <Tooltip label={tooltip} placement="bottom">
                <Flex flexDirection="row" alignItems="center" gap={1}>
                    <StatLabel>{label}</StatLabel>
                    <RiInformationFill />
                </Flex>
            </Tooltip>

            <>
                <StatNumber>{number}</StatNumber>
                <StatHelpText fontSize={14} color="gray">
                    {tip}
                </StatHelpText>
            </>
        </Stat>
    );
};

export default ModelStat;
