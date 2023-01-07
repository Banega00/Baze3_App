import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { CustomResponse } from '../../../shared-items/custom-response.model'
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
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

  saveVehicle(vehicle: VoziloModel){
    return this.http.post<CustomResponse<any>>(`${this.host}/vozilo`, vehicle)
  }

  deleteVehicle(vehicle: VoziloModel){
    return this.http.delete<CustomResponse<any>>(`${this.host}/vozilo/${vehicle.broj_sasije}`)
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
  
  getVlasnistva() {
    return this.http.get<CustomResponse<{ [key: string]: VlasnistvoModel[]}>>(`${this.host}/vlasnistva`)
  }

  deleteVlasnistvo(vlasnistvo: VlasnistvoModel & { isEdit: boolean; }) {
    return this.http.delete<CustomResponse<any>>(`${this.host}/vlasnistvo`,{body: vlasnistvo})
  }

  saveVlasnistvo(vlasnistvo: VlasnistvoModel & { isEdit: boolean; }) {
    return this.http.post<CustomResponse<any>>(`${this.host}/vlasnistvo`, vlasnistvo)
  }

  getUlice() {
    return this.http.get<CustomResponse<any>>(`${this.host}/ulice`)
  }

  deleteUlica(ulica:any) {
    return this.http.delete<CustomResponse<any>>(`${this.host}/ulica`,{body: ulica})
  }

  saveUlica(ulica:any) {
    return this.http.post<CustomResponse<any>>(`${this.host}/ulica`,ulica)
  }

  getIzvestaji() {
    return this.http.get<CustomResponse<any>>(`${this.host}/izvestaji`)
  }

  changeAntifrizTackaMrz(izvestaj_id:number, promena_za:number) {
    return this.http.put<CustomResponse<any>>(`${this.host}/izvestaji`,{izvestaj_id, promena_za})
  }
}
