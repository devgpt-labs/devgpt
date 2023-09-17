import { encode } from "gpt-tokenizer";

const getTokenLength = (string: string) => {
	// Usage
	// getTokenLength(
	//   "hello world, how are you dooooing today!! :) ) )! )!) famsdf 1 2 3 "
	// ).tokens

	const encoded = encode(string);
	const tokens = encoded.length;

	return { encoded, tokens };
};

export default getTokenLength;
