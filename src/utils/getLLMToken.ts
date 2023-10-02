//configs
import LLMTokens from "@/configs/LLMTokens";

const getLLMToken = () => {
  const tokensNo: any = process?.env?.NEXT_PUBLIC_OPEN_AI_KEYS || 1;

  return LLMTokens[Math.floor(Math.random() * tokensNo)];
};
export default getLLMToken;
