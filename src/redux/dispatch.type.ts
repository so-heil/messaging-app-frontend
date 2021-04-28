import { Action } from "redux";
import { AppState } from "./app-state.interface";
import { ThunkDispatch } from "redux-thunk";
import { AppServices } from "./app-services.interface";

export type AppDispatch = ThunkDispatch<AppState, AppServices, Action>;
