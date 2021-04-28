import { UserDto } from "@services/interfaces/User.dto";
export type Step = "First" | "Second" | "Third";
export interface AuthState {
    user: UserDto | null;
    errorMessage?: string;
    loading?: boolean;
    step: Step;
}
export enum AuthActionTypes {
    authenticated = "auth/authenticated",
    processing = "auth/processing",
    fail = "auth/fail",
    changeStep = "auth/change-step",
}
