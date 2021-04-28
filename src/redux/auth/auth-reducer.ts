import { AnyAction } from "redux";
import { UserDto } from "@services/interfaces/User.dto";
import { AuthActionTypes, AuthState, Step } from "./auth-types";

const initialState: AuthState = {
    user: null,
    step: "First",
};

export const authReducer = (
    state: AuthState = initialState,
    action: AnyAction,
): AuthState => {
    switch (action.type) {
        case AuthActionTypes.processing: {
            return {
                ...state,
                loading: true,
                errorMessage: undefined,
            };
        }
        case AuthActionTypes.authenticated: {
            return {
                ...state,
                loading: false,
                errorMessage: undefined,
                user: action.payload as UserDto,
            };
        }
        case AuthActionTypes.fail: {
            return {
                ...state,
                loading: false,
                errorMessage: action.payload as string,
            };
        }
        case AuthActionTypes.changeStep: {
            return {
                ...state,
                loading: false,
                errorMessage: undefined,
                step: action.payload as Step,
            };
        }

        default:
            return state;
    }
};
