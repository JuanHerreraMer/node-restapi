/*
    Rutas de Usuarios / Registro
    host + /api/registro
*/
import { Router } from "express";
import { validarJWT } from '../middlewares'
import { insertRegistroMarca, getRegistroMarca } from '../controllers/marcasController';

const router = Router();

router.post('/create', validarJWT, insertRegistroMarca);

router.post('/RegistroMarca', validarJWT, getRegistroMarca);


export default router