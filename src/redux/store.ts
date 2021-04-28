import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import AuthServices from "@services/AuthServices";
import { AppServices } from "./app-services.interface";
import { AppState } from "./app-state.interface";
import { authReducer } from "./auth/auth-reducer";
import UsersServices from "@services/UserServices";
import { contactsReducer } from "./contacts/contacts-reducer";
import ChatServices from "@services/ChatServices";
import { chatsReducer } from "./chat/chat-reducer";

const store = createStore(
    combineReducers<AppState>({
        auth: authReducer,
        contacts: contactsReducer,
        chats: chatsReducer,
    }),
    applyMiddleware(
        thunkMiddleware.withExtraArgument<AppServices>({
            auth: new AuthServices(),
            users: new UsersServices(),
            chat: new ChatServices(),
        }),
    ),
);

export default store;
