import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  sendGetRequest(url: string) {
    return this.http.get(url);
  }

  sendPostRequest(url: string, data: any) {
    return this.http.post(url, data);
  }

  sendPutRequest(url: string, data: any) {
    return this.http.put(url, data);
  }

  sendDeleteRequest(url: string) {
    return this.http.delete(url);
  }
}
