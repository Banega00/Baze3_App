import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MarkaVozilaModel } from '@shared-items/models/marka-vozila.model';
import { CustomResponse } from '../../../shared-items/custom-response.model'
import { KlijentModel } from '@shared-items/models/klijent.model';
import { VoziloModel } from '@shared-items/models/vozilo.model';
import { VlasnistvoModel } from '@shared-items/models/vlasnistvo.model';
import { RacunModel } from '@shared-items/models/racun.model';
import { RadnikModel } from '@shared-items/models/radnik.model';
import { ProizvodModel } from '@shared-items/models/proizvod.model';
import { StavkaRacunaModel } from '@shared-items/models/stavka-racuna.model';
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
  
  getVozila(params?:any){
    return this.http.get<CustomResponse<VoziloModel[]>>(`${this.host}/vozila`,{params})
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

  getRadniNalozi() {
    return this.http.get<CustomResponse<any>>(`${this.host}/radni-nalozi`)
  }

  changeAntifrizTackaMrz(izvestaj_id:number, promena_za:number) {
    return this.http.put<CustomResponse<any>>(`${this.host}/izvestaji`,{izvestaj_id, promena_za})
  }

  deleteRadniNalog(id: number) {
    return this.http.delete<CustomResponse<any>>(`${this.host}/radni-nalog/${id}`)
  }

  getRadnici() {
    return this.http.get<CustomResponse<any>>(`${this.host}/radnici`)
  }

  saveRadniNalog(radni_nalog:any) {
    return this.http.post<CustomResponse<any>>(`${this.host}/radni-nalog`,radni_nalog)
  }
  
  getPonude() {
    return this.http.get<CustomResponse<any>>(`${this.host}/ponude`)
  }

  savePonuda(ponuda:any) {
    return this.http.post<CustomResponse<any>>(`${this.host}/ponuda`,ponuda)
  }

  deletePonuda(id:any) {
    return this.http.delete<CustomResponse<any>>(`${this.host}/ponuda/${id}`)
  }

  deleteRadnik(jmbg: string){
    return this.http.delete<CustomResponse<any>>(`${this.host}/radnik/${jmbg}`)
  }

  getPozicije(){
    return this.http.get<CustomResponse<any>>(`${this.host}/pozicije`)
  }

  addNoviRadnik(radnik:RadnikModel){
    return this.http.post<CustomResponse<any>>(`${this.host}/radnik`, radnik)
  }

  updateRadnik(data: RadnikModel){
    return this.http.put<CustomResponse<any>>(`${this.host}/radnik`, data)
  }

  getRacuni(){
    return this.http.get<CustomResponse<RacunModel[]>>(`${this.host}/racuni`)
  }
  
  obrisiRacun(id: number){
    return this.http.delete<CustomResponse<RacunModel[]>>(`${this.host}/racun/${id}`)
  }

  getProizvodi(){
    return this.http.get<CustomResponse<ProizvodModel[]>>(`${this.host}/proizvodi`)
  }

  deleteStavkaRacuna(stavka:StavkaRacunaModel){
    return this.http.delete<CustomResponse<any>>(`${this.host}/stavka-racuna`,{body:stavka})
  }

  saveNewStavka(stavka:StavkaRacunaModel){
    return this.http.post<CustomResponse<any>>(`${this.host}/stavka-racuna`, stavka)
  }

  changeRadnikOnPonuda(ponuda:any){
    return this.http.put<CustomResponse<any>>(`${this.host}/ponuda/radnik`, ponuda)
  }
}
