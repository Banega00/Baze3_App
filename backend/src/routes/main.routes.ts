import express from "express";
import { MainController } from "../controllers/MainController";

const router = express.Router();

const mainController = new MainController();

router.get('/marke/modeli', mainController.getMarkeIModeleVozila)

export const main_router = router;