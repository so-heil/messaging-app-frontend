import { AppServices } from "@redux/app-services.interface";
import { AppState } from "@redux/app-state.interface";
import { AppDispatch } from "@redux/dispatch.type";
import { AuthRequestDto } from "@services/interfaces/AuthRequest.dto";
import { LoginDto } from "@services/interfaces/Login.dto";
import { UpdateProfileDto } from "@services/interfaces/updateProfile.dto";
import { AuthActionTypes, Step } from "./auth-types";

export abstract class authActions {
    public static register(
        dispatch: AppDispatch,
        dto: AuthRequestDto,
    ): Promise<void> {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                _getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                localDispatch({ type: AuthActionTypes.processing });
                try {
                    const user = (await services.auth.register(dto)).data;

                    localDispatch({
                        type: AuthActionTypes.authenticated,
                        payload: user,
                    });
                } catch (error) {
                    localDispatch({
                        type: AuthActionTypes.fail,
                        payload: error.message ?? "Cannot Authenticate",
                    });
                }
            },
        );
    }

    public static changeStep(dispatch: AppDispatch, step: Step): Promise<void> {
        return dispatch(
            async (localDispatch: AppDispatch): Promise<void> => {
                localDispatch({
                    type: AuthActionTypes.changeStep,
                    payload: step,
                });
            },
        );
    }

    public static login(dispatch: AppDispatch, dto: LoginDto): Promise<void> {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                _getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                localDispatch({ type: AuthActionTypes.processing });
                try {
                    const user = (await services.auth.login(dto)).data;
                    if (user.id) {
                        localDispatch({
                            type: AuthActionTypes.authenticated,
                            payload: user,
                        });
                    }
                } catch (e) {
                    localDispatch({
                        type: AuthActionTypes.changeStep,
                        payload: "Third",
                    });
                }
            },
        );
    }

    public static updateProfile(
        dispatch: AppDispatch,
        dto: UpdateProfileDto,
    ): Promise<void> {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                _getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                localDispatch({ type: AuthActionTypes.processing });
                try {
                    const user = (await services.auth.update(dto)).data;

                    localDispatch({
                        type: AuthActionTypes.authenticated,
                        payload: user,
                    });
                } catch (error) {
                    localDispatch({
                        type: AuthActionTypes.fail,
                        payload: error.message ?? "Cannot Update",
                    });
                }
            },
        );
    }

    public static checkIdentity(dispatch: AppDispatch): Promise<void> {
        return dispatch(
            async (
                localDispatch: AppDispatch,
                _getState: () => AppState,
                services: AppServices,
            ): Promise<void> => {
                localDispatch({ type: AuthActionTypes.processing });
                try {
                    const user = (await services.auth.checkIdentity()).data;

                    localDispatch({
                        type: AuthActionTypes.authenticated,
                        payload: user,
                    });
                } catch (error) {
                    localDispatch({
                        type: AuthActionTypes.fail,
                        payload: undefined,
                    });
                }
            },
        );
    }
}
