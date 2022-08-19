import {Timestamp} from "@firebase/firestore";

export interface MessageType {
    text: string;
    timestamp: Timestamp;
    sender: string;
}