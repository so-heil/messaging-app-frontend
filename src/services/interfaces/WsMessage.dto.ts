import { MessageDto } from "./Message.dto";

export type WsMessageDto = MessageDto & { chatId: string };
