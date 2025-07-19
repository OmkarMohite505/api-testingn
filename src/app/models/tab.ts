import { HttpHeaders, HttpParams } from "@angular/common/http";
import { RequestType } from "./RequestType";

export interface Tab {
    id: string;
    parentId?: string;
    label?: string;
    closable?: boolean;
    response: Response;
    request: Request;
    isSaved: boolean;
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
  headers?: HttpHeaders;
  params?: HttpParams;
  contentType?: any;
}
