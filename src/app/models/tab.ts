import { RequestType } from "./RequestType";

export interface Tab {
    id: number;
    name?: string;
    reqType: RequestType;
    Url: string;
    body?: string;
    headers?: string;
    params?: KeyValuePair[];
    closable?: boolean;
}

export interface KeyValuePair {
  key: string;
  value: string;
}
