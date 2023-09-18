const sendOpenRouter = async ({
  stream,
  model,
  role,
  content,
  call,
  functions,
  temperature,
}: any) => {
  const apiKey = process?.env?.OPEN_ROUTER_KEY;

  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "HTTP-Referer": "https://devgpt.com",
        "X-Title": "devgpt",
      },
      body: JSON.stringify({
        model: model,
        stream: stream,
        messages: [
          { role: "system", content: role },
          { role: "user", content: content },
          ...(call ? [call] : []),
        ],
        functions: functions,
        temperature: temperature || 0,
      }),
    }
  );

  return await response.json().then((data: any) => {
    console.log({ data });
    if (functions) {
      console.log({ functions });

      return {
        error: data?.error,
        response: data?.choices[0].message.function_call.arguments,
        data: data,
      };
    }

    return {
      error: data?.error,
      response: data?.choices?.[0]?.message?.content,
      data: data,
    };
  });
};

export default sendOpenRouter;
