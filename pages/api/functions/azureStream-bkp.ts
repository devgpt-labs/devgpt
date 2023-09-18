import { OpenAIClient, AzureKeyCredential } from "@azure/openai";

const azureKey = process.env.AZURE_API_KEY;
const azureURL = process.env.AZURE_ENDPOINT;

console.log("IMPORTANT:", { azureKey, azureURL });

const azure = new OpenAIClient(
  String(azureURL),
  new AzureKeyCredential(String(azureKey))
);

const deploymentId = "devgpt-4-32k";

const azureStream = async ({ model, messages, temperature }: any) => {
  console.log("attempting azure...");

  console.log({ messages, temperature, model });

  const response: any = await azure.getChatCompletions(deploymentId, messages, {
    temperature: temperature,
    stream: true,
  });

  // model: model,
  // stream: true,
  console.log("FOO1", { response });
  console.log("BAR2", response?.choices);

  return response;
};

export default azureStream;