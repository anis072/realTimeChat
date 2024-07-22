import { Message } from "./message";

export interface Conversation {
    id: string;
    name: string;
    avatar: string;
    lastMessage: string;
    messages: Message[];
    participants:any[]
  }