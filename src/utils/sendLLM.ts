const sendLLM = async (
  email: string,
  prompt: string,
  functions?: any,
  system?: string,
  messages?: any,
  customer?: any,
  chargeable?: boolean
) => {
  const response: Response = await fetch("/api/no-stream", {
    method: "POST",
    body: JSON.stringify({
      email: email,
      prompt: prompt,
      functions: functions,
      system: system,
      messages: messages,
      customer: customer,
      chargeable: chargeable,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  return json.data;
};

export default sendLLM;
