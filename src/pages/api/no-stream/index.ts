import OpenAI from "openai";

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const openai = new OpenAI({
	apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY,
});

const handler = async (req: Request, res: Response) => {
	let { prompt } = await req.json();

	const response: any = await openai.chat.completions.create({
		model: "gpt-3.5-turbo",
		messages: [{ role: "user", content: prompt }],
	});

	// Respond with the first choice
	return res.status(200).json({ response: response.choices[0].text });
};

export default handler;
