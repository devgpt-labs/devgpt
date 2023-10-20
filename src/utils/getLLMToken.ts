//configs
import LLMTokens from "@/configs/LLMTokens";

const getLLMToken = () => {
  const tokensNo: any = process?.env?.NEXT_PUBLIC_OPEN_AI_ORGS || 1;

  //get random number between 0 and tokensNo
  //return LLMTokens[getRandomInt(1, tokensNo)];
  return LLMTokens[getRandomInt(1, 2)];
};
export default getLLMToken;

//function to get int between two numbers
const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
