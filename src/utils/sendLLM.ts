const sendLLM = async (prompt: string, functions?: any, system?: string) => {
  const response: Response = await fetch("/api/no-stream", {
    method: "POST",
    body: JSON.stringify({
      prompt: prompt,
      functions: functions,
      system: system,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  return json.data;
};

export default sendLLM;
