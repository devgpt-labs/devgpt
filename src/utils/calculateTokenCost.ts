const calculateTokenCost = (tokens: number) => {
  tokens / 1000; //charge is per 1000 tokens

  //https://help.openai.com/en/articles/7127956-how-much-does-gpt-4-cost
  const sampled_gpt_4_token_cost = 0.06;
  const devgpt_fee = 0.4;
  const tokenCost = sampled_gpt_4_token_cost * (1 + devgpt_fee);

  return Math.ceil(Number(tokenCost) * Number(tokens)) / 100;
};

export default calculateTokenCost;
