import express from "express";
import { MainController } from "../controllers/MainController";

const router = express.Router();

const mainController = new MainController();

router.get('/marke/modeli', mainController.getMarkeIModeleVozila)
router.get('/klijenti', mainController.getKlijenti)
router.put('/klijent', mainController.updateKlijent)
router.post('/klijent', mainController.addNewKlijent)
router.delete('/klijent/:jmbg', mainController.deleteKlijent)

export const main_router = router;