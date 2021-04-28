import { AxiosResponse } from "axios";
import { SocketHelper } from "src/helpers/socket-helper";
import { SimpleEventDispatcher } from "strongly-typed-events";
import { api } from "./config/axios.config";
import { ChatDto } from "./interfaces/Chat.dto";
import { CreateChatDto } from "./interfaces/createChat.dto";
import { MessageDto } from "./interfaces/Message.dto";
import { SendMessageDto } from "./interfaces/sendMessageDto";
import { WsMessageDto } from "./interfaces/WsMessage.dto";

export default class ChatServices extends SocketHelper {
    public readonly onNewMessageReceived = new SimpleEventDispatcher<WsMessageDto>();

    public constructor() {
        super();
        this.registerEvent("RECEIVE_MESSAGE", this.onNewMessageReceived);
    }

    public sendMessage = (
        dto: SendMessageDto,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        callback: (res: any) => void,
    ): void => {
        this.sendEvent("SEND_MESSAGE", dto, callback);
    };

    public authenticate = (dto: { id: string }): void => {
        this.sendEvent("AUTH_SOCKET", dto);
    };

    public async createChat(
        data: CreateChatDto,
    ): Promise<AxiosResponse<ChatDto>> {
        return await api.request({
            method: "POST",
            url: "/users/chat",
            data,
        });
    }

    public async getChats(): Promise<AxiosResponse<ChatDto[]>> {
        return await api.request({
            method: "GET",
            url: "/users/chat",
        });
    }

    public async getMessages(
        chatId: string,
    ): Promise<AxiosResponse<MessageDto[]>> {
        return await api.request({
            method: "GET",
            url: `users/chat/messages/${chatId}`,
        });
    }
}
