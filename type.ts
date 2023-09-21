const requiredServerEnvs = [
  "NEXT_PUBLIC_AZURE_OPEN_AI_KEY",
  "NEXT_PUBLIC_AZURE_OPEN_AI_BASE",
  "NEXT_PUBLIC_AZURE_OPEN_AI_CHAT_VERSION",
] as const;

type RequiredServerEnvKeys = (typeof requiredServerEnvs)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
  }
}

export {};
