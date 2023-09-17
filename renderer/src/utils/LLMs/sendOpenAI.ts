const sendGPT4Request = async ({
  stream,
  model,
  role,
  content,
  call,
  functions,
  temperature,
}: any) => {
  const apiKey = process?.env?.NEXT_PUBLIC_OPENAI_API_KEY;
  const endpoint = "https://api.openai.com/v1/chat/completions";

  let tokens;

  switch (model) {
    case "gpt-4":
      tokens = 4000;
      break;
    case "gpt-4-32k":
      tokens = 10000;
      break;
    default:
      tokens = 2000;
      break;
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };

  const data = {
    temperature: temperature,
    model: model,
    stream: stream,
    functions: functions,
    messages: [
      {
        role: "system",
        content: role,
      },
      {
        role: "user",
        content: content,
      },
      ...(call ? [call] : []),
    ],
    max_tokens: tokens,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();

      if (functions) {
        return {
          response: responseData.choices[0].message.function_call.arguments,
        };
      }

      return { response: responseData.choices[0].message.content };
    }

    return null;
  } catch (error) {
    return error;
  }
};

export default sendGPT4Request;
