/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

import { Router } from 'express'

import { getAllUsers, createNewUser, getUserById, deleteUserById, updateUserById, loginUser } from '../controllers/authController'

const router = Router();

router.get('/', getAllUsers);

router.post('/', loginUser);

router.post('/create', createNewUser);

router.get('/:id', getUserById);

router.delete('/:id', deleteUserById);

router.put('/:id', updateUserById);



export default router