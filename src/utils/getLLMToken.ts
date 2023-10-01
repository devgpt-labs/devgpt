require("dotenv").config();

const getLLMToken = () => {
  const tokensNo: any = process?.env?.NEXT_PUBLIC_OPEN_AI_KEYS || 1;

  console.log({ tokensNo });

  console.log("here", process.env);

  let tokens = [];

  for (let i = 0; i < tokensNo; i++) {
    const tokenKey = `NEXT_PUBLIC_OPEN_AI_KEY_${String(i + 1)}`;
    //todo make this use tokenKey
    tokens.push(process?.env?.[`NEXT_PUBLIC_OPEN_AI_KEY_1`]);
  }

  tokens = tokens.filter((token) => token);

  return tokens[Math.floor(Math.random() * tokens.length)];
};
export default getLLMToken;
