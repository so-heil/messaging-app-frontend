import { AnyAction } from "@reduxjs/toolkit";
import { ChatDto } from "@services/interfaces/Chat.dto";
import { ChatActionTypes, ChatState } from "./chat-types";

const initialState: ChatState = {
    chats: [],
};

export const chatsReducer = (
    state: ChatState = initialState,
    action: AnyAction,
): ChatState => {
    switch (action.type) {
        case ChatActionTypes.MessageReceived: {
            const updatedChats: ChatDto[] = state.chats.map((chat) => {
                const oldMessages = chat.messages ?? [];
                return chat.id === action.payload.chatId
                    ? {
                          ...chat,
                          messages: [
                              ...oldMessages,
                              {
                                  content: action.payload.content,
                                  sentAt: action.payload.sentAt,
                                  id: action.payload.id,
                                  user: action.payload.user,
                              },
                          ],
                      }
                    : chat;
            });
            return {
                ...state,
                chats: updatedChats,
            };
        }

        case ChatActionTypes.MessageSent: {
            const updatedChats: ChatDto[] = state.chats.map((chat) => {
                const oldMessages = chat.messages ?? [];
                return chat.id === action.payload.chatId
                    ? {
                          ...chat,
                          messages: [
                              ...oldMessages,
                              {
                                  ...action.payload,
                              },
                          ],
                      }
                    : chat;
            });
            return {
                ...state,
                chats: updatedChats,
            };
        }

        case ChatActionTypes.Fetching: {
            return {
                ...state,
                loading: true,
                error: undefined,
            };
        }

        case ChatActionTypes.Chats: {
            return {
                ...state,
                loading: false,
                chats: action.payload as ChatDto[],
            };
        }

        case ChatActionTypes.NewChat: {
            return {
                ...state,
                loading: false,
                chats: [...state.chats, action.payload as ChatDto],
                error: undefined,
            };
        }

        case ChatActionTypes.Failed: {
            return {
                ...state,
                loading: false,
                error: action.payload as string,
            };
        }

        case ChatActionTypes.MessagesFetching: {
            return {
                ...state,
                selectedChat: action.payload as string,
                messagesLoading: true,
            };
        }

        case ChatActionTypes.MessagesFetched: {
            const updatedChats: ChatDto[] = state.chats.map((chat) =>
                chat.id === action.payload.chat.id
                    ? { ...chat, messages: action.payload.messages }
                    : chat,
            );
            return {
                ...state,
                chats: updatedChats,
                messagesLoading: false,
            };
        }

        case ChatActionTypes.MessagesFail: {
            return {
                ...state,
                selectedChat: undefined,
                messagesLoading: false,
            };
        }
        default:
            return state;
    }
};
