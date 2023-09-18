export default async function handler(req: any, res: any) {
  res
    .status(200)
    .send({
      data: "This version is no longer support, please upgrade to 1.2.0 at https://devgpt.com.",
    });
}
