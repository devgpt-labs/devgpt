//configs
import LLMTokens from "@/configs/LLMTokens";

const getLLMToken = () => {
  //get random number between 0 and tokensNo
  return get_random(LLMTokens);
};
export default getLLMToken;

function get_random(list: any[]) {
  return list[Math.floor(Math.random() * list.length)];
}
