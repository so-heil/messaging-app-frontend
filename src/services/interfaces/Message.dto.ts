import { UserDto } from "./User.dto";

export interface MessageDto {
    id: string;
    content: string;
    user?: Partial<UserDto>;
    sentAt?: string;
}
