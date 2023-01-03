import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { CustomResponse } from '../../../shared-items/custom-response.model'
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private host = 'http://localhost:3001'
  constructor(private http: HttpClient) { }

  getMarkeIModeliVozila(){
    return this.http.get<CustomResponse<MarkaVozilaModel[]>>(`${this.host}/marke/modeli`)
  }

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
