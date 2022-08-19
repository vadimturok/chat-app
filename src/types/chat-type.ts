import {MessageType} from "./message-type";

export interface Chat{
    id: string;
    users: string[];
    latestMessage: MessageType;
}