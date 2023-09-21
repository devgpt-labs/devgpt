export type RoleTypes = "system" | "user" | "assistant";

export interface Message {
  role: RoleTypes;
  content: string;
}
