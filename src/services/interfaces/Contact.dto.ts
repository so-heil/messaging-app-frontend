import { UserDto } from "./User.dto";

export interface ContactDto {
    id: string;
    name: string;
    relatesTo: UserDto;
    owner?: UserDto;
}
