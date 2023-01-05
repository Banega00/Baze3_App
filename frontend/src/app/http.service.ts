import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { CustomResponse } from '../../../shared-items/custom-response.model'
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private host = 'http://localhost:3001';
  constructor(private http: HttpClient) { }

  updateKlijent(data: KlijentModel){
    return this.http.put(`${this.host}/klijent`, data)
  }

  getMarkeIModeliVozila(){
    return this.http.get<CustomResponse<MarkaVozilaModel[]>>(`${this.host}/marke/modeli`)
  }

  getKlijent(){
    return this.http.get<CustomResponse<KlijentModel[]>>(`${this.host}/klijenti`)
  }

  addNewClient(klijent: KlijentModel){
    return this.http.post<CustomResponse<any>>(`${this.host}/klijent`, klijent)
  }

  deleteKlijent(jmbg: string){
    return this.http.delete<CustomResponse<any>>(`${this.host}/klijent/${jmbg}`)
  }
  
  getVozila(){
    return this.http.get<CustomResponse<VoziloModel[]>>(`${this.host}/vozila`)
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
