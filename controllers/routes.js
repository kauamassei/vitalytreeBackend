import { Router } from "express";
import authRouter from "./authController.js";
import espcialistaRouter  from "./especialistaController.js";
import clinicaRouter  from "./clinicaController.js";
import doencaRouter  from "./doencaController.js";
import assinaturaRouter  from "./assinaturaController.js";
import mercadoPagoRouter  from "./mercadoPagoController.js";

const router = Router();

router.use("/",authRouter);
router.use("/",espcialistaRouter);
router.use("/",clinicaRouter);
router.use("/",doencaRouter);
router.use("/",assinaturaRouter);
router.use("/",mercadoPagoRouter);

export default router;
