import AuthServices from "@services/AuthServices";
import ChatServices from "@services/ChatServices";
import UsersServices from "@services/UserServices";

export interface AppServices {
    auth: AuthServices;
    users: UsersServices;
    chat: ChatServices;
}
