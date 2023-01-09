import express from "express";
import { MainController } from "../controllers/MainController";

const router = express.Router();

const mainController = new MainController();

router.get('/marke/modeli', mainController.getMarkeIModeleVozila)

//KLIJENTI CRUD
router.get('/klijenti', mainController.getKlijenti)
router.put('/klijent', mainController.updateKlijent)
router.post('/klijent', mainController.addNewKlijent)
router.delete('/klijent/:jmbg', mainController.deleteKlijent)

//VOZILA
router.get('/vozila', mainController.getVozila)
router.post('/vozilo', mainController.saveVozilo)
router.delete('/vozilo/:broj_sasije', mainController.deleteVozilo)

//VLASNISTVA
router.get('/vlasnistva', mainController.getVlasnistva)
router.delete('/vlasnistvo', mainController.deleteVlasnistvo)
router.post('/vlasnistvo', mainController.saveVlanistvo)

//ULICE
router.get('/ulice', mainController.getUlice)
router.post('/ulica', mainController.saveUlica)
router.delete('/ulica', mainController.deleteUlica)

//IZVESTAJI
router.get('/izvestaji', mainController.getIzvestaji)
router.put('/izvestaji', mainController.updateIzvestaj)

//RADNI NALOG
router.get('/radni-nalozi', mainController.getRadniNalozi)
router.delete('/radni-nalog/:id', mainController.deleteRadniNalog)
router.post('/radni-nalog', mainController.createRadniNalog)

//RADNICI
router.get('/radnici', mainController.getRadnici);
router.put('/radnik', mainController.updateRadnik);
router.post('/radnik', mainController.addNewRadnik);
router.delete('/radnik/:jmbg', mainController.deleteRadnik);

//PONUDE
router.get('/ponude',mainController.getPonude)
router.post('/ponuda',mainController.savePonuda)
router.delete('/ponuda/:id',mainController.deletePonuda)

//POZICIJE
router.get('/pozicije', mainController.getPozicije);

//RACUNI
router.get('/racuni', mainController.getRacuni)
router.delete('/racun/:id', mainController.deleteRacun)

//PROIZVODI
router.get('/proizvodi', mainController.getProizvodi)
router.get('/jedinice-mere', mainController.getJediniceMere)
router.get('/valute', mainController.getValute)

export const main_router = router;