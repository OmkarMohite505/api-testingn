import { RequestType } from "./RequestType";

export interface Tab {
    id: number;
    name?: string;
    reqType: string;
    Url: string;
    body?: string;
    headers?: string;
    params?: KeyValuePair[];
    closable?: boolean;
    response?: any;
    errors?: any;
}

export interface KeyValuePair {
  key: string;
  value: string;
}
