import { RequestType } from "./RequestType";

export interface Tab {
    id: string;
    name?: string;
    closable?: boolean;
    response: Response;
    request: Request;
}

export interface KeyValuePair {
  key: string;
  value: string;
}

export interface Response{
  body: any;
  headers?: any;
  status?: number;
  statusText?: string;
}

export interface Request{
  url: string;
  reqType: string;
  body?: any;
  headers?: any;
  params?: KeyValuePair[];
  contentType?: any;
}
