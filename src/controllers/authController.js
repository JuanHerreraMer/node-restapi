import { json, response } from 'express';
import bcrypt from 'bcryptjs';
import { getConnection, authQuerys, sql } from '../database';

const nameController = 'authController'

export const getAllUsers = async(req, res = response) => {

    try {

        const pool = await getConnection();
        const result = await pool.request().query( authQuerys.getAllUsers );
        
        pool.close();

        const { recordset, rowsAffected } = result;

        return res.json({
            ok: true,
            rowsAffected,
            result: recordset
        })

    } catch (error) {
        console.log(`${nameController}: [getAllUsers]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con TI - [authController]'
        })
    }

}

export const loginUser = async(req, res = response) => {

    try {
        
        const { rut, password } = req.body;

        const pool = await getConnection();
        // const { recordset } = await pool.request().query( authQuerys.getUserByRut );
        const result = await pool.request()
                            .input('Id', sql.Int, undefined)
                            .execute(authQuerys.sp_control_FuncionariosSelect)

                            pool.close();

        const userLogin = result.recordset.filter( ({Rut, Clave}) => Rut === rut && Clave === password );

            if(userLogin.length <= 0){
                return res.status(400).json({
                    ok: false,
                    msg: 'Credenciales incorrectas'
                })
            }
        
        res.json({
            ok: true,
            idUser: userLogin,

        })

    } catch (error) {
        console.log(`${nameController}: [loginUser]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con TI - [authController]'
        })
    }

}

export const createNewUser = async(req, res = response) => {

    try {
        const { rut, empresa, correo } = req.body;

        const rutReloj = rut.split('-')[0];
        const clave = rut.substring(0, 4);
        const estado = 'ACTIVO';

        const pool = await getConnection();

        const users = await pool.request().query( authQuerys.getAllUsers );
        
        const userFilter = users.recordset.filter( user => user.Rut === rut);

        if( userFilter.length > 0 ){
            return res.status(400).json({
                ok: false,
                msg: 'Este rut ya se encuentra registrado'
            })
        }

        const result = await pool.request()
                                .input('rut', sql.VarChar, rut)
                                .input('rutReloj', sql.VarChar, rutReloj)
                                .input('empresa', sql.VarChar, empresa)
                                .input('clave', sql.VarChar, clave)
                                .input('correo', sql.VarChar, correo)
                                .input('estado', sql.VarChar, estado)
                                .query( authQuerys.createNewUser );

        pool.close();

        const { rowsAffected, recordset } = result;

        res.json({
            ok: true,
            idUser: recordset ? recordset[0].ID : 0,
            rowsAffected
        })

    } catch (error) {
        console.log(`${nameController}: [createNewUser]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con TI - [authController]'
        })
    }

}

export const getUserById = async(req, res = response) => {

    const { id } = req.params;
    try {
        const pool = await getConnection();
        const result = await pool.request()
                                .input("id", id)
                                .query( authQuerys.getUserById );
        pool.close();

        const { recordset, rowsAffected } = result;

        res.json({
            ok: true,
            rowsAffected,
            result: recordset
        })

    } catch (error) {
        console.log(`${nameController}: [getUserById]: ${error}`)
        res.status(500).json({
            ok: false,
            msg: `Por favor hable con TI - [${nameController}]`
        })
    }

}
export const deleteUserById = async(req, res = response) => {

    const { id } = req.params;

    try {
        
        const pool = await getConnection();
        const result = await pool.request().input( "id", id ).query( authQuerys.deleteUserById );

        pool.close();

        res.json({
            ok: true,
            result: result.rowsAffected
        })

    } catch (error) {
        console.log(`${nameController}: [deleteUserById]: ${error}`)
        res.status(500).json({
            ok: false,
            msg: `Por favor hable con TI - [${nameController}]`
        })
    }

}
export const updateUserById = async(req, res = response) => {

    try {

        const { id } = req.params;
        const { empresa, clave, correo, estado } = req.body;

        const pool = await getConnection();
        const result = await pool.request()
                                .input('id', sql.Int, id)
                                .input('empresa', sql.VarChar, empresa)
                                .input('clave', sql.VarChar, clave)
                                .input('correo', sql.VarChar, correo)
                                .input('estado', sql.VarChar, estado)
                                .query( authQuerys.updateUserById );
        pool.close();
                                
        res.json({
            ok: true,
            result: result.rowsAffected
        })
        
    } catch (error) {
        console.log(`${nameController}: [updateUserById]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con TI - [authController]'
        })
    }

}



