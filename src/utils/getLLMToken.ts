//configs
import LLMTokens from "@/configs/LLMTokens";

const getLLMToken = () => {
  const tokensNo: any = process?.env?.NEXT_PUBLIC_OPEN_AI_ORGS || 0;

  //get random number between 0 and tokensNo
  return LLMTokens[Math.floor(Math.random() * tokensNo)];
};
export default getLLMToken;
