const sendLLM = async (prompt: string, functions?: any) => {
  const response: Response = await fetch("/api/no-stream", {
    method: "POST",
    body: JSON.stringify({ prompt: prompt, functions: functions }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  return json.data;
};

export default sendLLM;
