import { AppServices } from "@redux/app-services.interface";
import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { ChatDto } from "@services/interfaces/Chat.dto";
import { CreateChatDto } from "@services/interfaces/createChat.dto";
import { MessageDto } from "@services/interfaces/Message.dto";
import { SendMessageDto } from "@services/interfaces/sendMessageDto";
import { ChatActionTypes } from "./chat-types";

export abstract class ChatActions {
    public static Connect = (dispatch: AppDispatch): Promise<void> => {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                services.chat.onNewMessageReceived.clear();
                services.chat.authenticate({
                    id: getState().auth.user?.id ?? "",
                });
                services.chat.onNewMessageReceived.subscribe((message) => {
                    localDispatch({
                        type: ChatActionTypes.MessageReceived,
                        payload: message,
                    });
                });
            },
        );
    };

    public static createChat = (
        dispatch: AppDispatch,
        dto: CreateChatDto,
    ): Promise<void> => {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                try {
                    localDispatch({ type: ChatActionTypes.Fetching });
                    const newChat = (await services.chat.createChat(dto)).data;
                    localDispatch({
                        type: ChatActionTypes.NewChat,
                        payload: newChat,
                    });
                } catch (error) {
                    localDispatch({
                        type: ChatActionTypes.Failed,
                        payload:
                            error?.response?.data?.message ??
                            "Cannot create group",
                    });
                }
            },
        );
    };

    public static getChats = (dispatch: AppDispatch): Promise<void> => {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                try {
                    localDispatch({ type: ChatActionTypes.Fetching });
                    const chats = (await services.chat.getChats()).data;
                    localDispatch({
                        type: ChatActionTypes.Chats,
                        payload: chats,
                    });
                } catch (error) {
                    console.log(error);
                }
            },
        );
    };

    public static selectChat = (
        dispatch: AppDispatch,
        chat: ChatDto,
    ): Promise<void> => {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                try {
                    localDispatch({
                        type: ChatActionTypes.MessagesFetching,
                        payload: chat.id,
                    });
                    const messages = (await services.chat.getMessages(chat.id))
                        .data;

                    localDispatch({
                        type: ChatActionTypes.MessagesFetched,
                        payload: { messages, chat },
                    });
                } catch (error) {
                    localDispatch({
                        type: ChatActionTypes.Failed,
                        payload: error?.response?.data?.message,
                    });
                }
            },
        );
    };

    public static sendMessage = (
        dispatch: AppDispatch,
        dto: SendMessageDto,
    ): Promise<void> => {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                const handleResponse = (res: MessageDto) => {
                    if (res) {
                        localDispatch({
                            type: ChatActionTypes.MessageSent,
                            payload: res,
                        });
                    }
                };
                services.chat.sendMessage(dto, handleResponse);
            },
        );
    };
}
