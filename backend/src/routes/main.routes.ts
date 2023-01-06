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

export const main_router = router;