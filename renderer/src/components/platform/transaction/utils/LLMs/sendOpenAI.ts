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
    max_tokens: 2000,
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      return { response: responseData.choices[0].message.content };
    }

    return null;
  } catch (error) {
    return error;
  }
};

export default sendGPT4Request;
