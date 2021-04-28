import { ChatDto } from "@services/interfaces/Chat.dto";

export enum ChatActionTypes {
    MessageReceived = "chat/received",
    NewChat = "chat/newChat",
    Chats = "chats/chats",
    Fetching = "chats/fetching",
    Failed = "chats/failed",
    MessagesFetching = "chats/messages/fetching",
    MessagesFetched = "chats/messages/fetched",
    MessagesFail = "chats/messages/fail",
    MessageSent = "chats/messages/sent",
    MessageSend = "chats/messages/send",
}
export interface ChatState {
    chats: ChatDto[];
    loading?: boolean;
    error?: string;
    selectedChat?: string;
    messagesLoading?: boolean;
}
