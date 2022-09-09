/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

import { Router } from 'express'
import { check } from 'express-validator';
import { validarCampos } from '../middlewares'

import { getAllUsers, createNewUser, getUserById, deleteUserById, updateUserById, loginUser } from '../controllers/authController'

const router = Router();

router.get('/', getAllUsers);

router.post('/', [
    check('rut', 'Rut es obligatorio').not().isEmpty(),
    check('password', 'Password es obligatorio').not().isEmpty(),
    validarCampos
], loginUser);

router.post('/create', createNewUser);

router.get('/:id', getUserById);

router.delete('/:id', deleteUserById);

router.put('/:id', updateUserById);



export default router