const getLLMToken = () => {
  const tokensNo: any = process.env.NEXT_PUBLIC_OPEN_AI_KEYS || 1;

  let tokens = [];

  for (let i = 0; i < tokensNo; i++) {
    tokens.push(process.env?.[`NEXT_PUBLIC_OPENAI_KEY_${i}`]);
  }

  tokens = tokens.filter((token) => token);

  return tokens[Math.floor(Math.random() * tokens.length)];
};
export default getLLMToken;
