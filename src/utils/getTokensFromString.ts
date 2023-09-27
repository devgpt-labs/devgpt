import { encode } from "gpt-tokenizer";

const getTokensFromString = (string: string) => {
  const encoded = encode(string);
  return encoded?.length;
};

export default getTokensFromString;
