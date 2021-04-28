import { AuthState } from "./auth/auth-types";
import { ChatState } from "./chat/chat-types";
import { ContactsState } from "./contacts/contacts-types";

export interface AppState {
    auth: AuthState;
    contacts: ContactsState;
    chats: ChatState;
}
