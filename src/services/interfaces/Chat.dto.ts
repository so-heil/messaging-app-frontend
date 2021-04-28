import { MessageDto } from "./Message.dto";

export interface ChatDto {
    id: string;
    display_name: string;
    messages?: MessageDto[];
    photo_url?: string;
}
