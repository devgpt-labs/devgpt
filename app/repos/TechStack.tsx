import { Flex, FormControl, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import {
    AutoComplete,
    AutoCompleteInput,
    AutoCompleteTag,
} from "@choc-ui/chakra-autocomplete";

const TechStack = () => {
    const [inputValue, setInputValue] = useState<any>("");
    const [selectedValues, setSelectedValues] = useState<any>([]);

    const handleInputChange = (event: any) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyDown = (event: any) => {

        if (selectedValues.length >= 6) return;

        if (
            (event.key === "Enter" || event.key === "Tab" || event.key === ' ' || event.key === ',') &&
            inputValue.trim() !== ""
        ) {
            setSelectedValues([...selectedValues, inputValue.trim()]);
            setInputValue("");
        }
    };

    return (
        <Flex direction="column" width="100%">
            <FormControl id="email">
                <Text mb={2}>Tech Stack ({selectedValues.length}/6)</Text>
                <AutoComplete
                    freeSolo
                    creatable
                    openOnFocus
                    multiple
                >
                    <AutoCompleteInput
                        pt={4}
                        placeholder="What tech stack are you using? E.g React, Python, Go, etc."
                        flexDirection="row"
                        flexWrap="wrap"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                    >
                        {selectedValues.map((value: any, index: any) => (
                            <AutoCompleteTag
                                size='lg'
                                onRemove={() => {
                                    setSelectedValues(
                                        selectedValues.filter((val: any) => val !== value)
                                    );
                                }}
                                label={value}
                                key={index}
                            >
                                {value}
                            </AutoCompleteTag>
                        ))}
                    </AutoCompleteInput>
                </AutoComplete>
            </FormControl>
        </Flex>
    );
};

export default TechStack;
