import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  get<T>(url: string, params?: HttpParams | {[param: string]: string | number | boolean}): Observable<T> {
    return this.http.get<T>(url, { params });
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers });
  }

  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers });
  }

  patch<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(url, body, { headers });
  }

  delete<T>(url: string, params?: HttpParams | {[param: string]: string | number | boolean}): Observable<T> {
    return this.http.delete<T>(url, { params });
  }
}
