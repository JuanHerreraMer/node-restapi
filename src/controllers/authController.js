import bcrypt from 'bcryptjs';
import { response } from 'express';
import { authQuerys, getConnection, sql } from '../database';
import { generarJWT } from '../helpers/jwt';

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
                            .execute(authQuerys.sp_control_FuncionariosSelect);

                            pool.close();

        let user = result.recordset.filter(({Rut}) => Rut === rut);
        if( user.length > 0 ){
            user = user.reduce( acc => { return acc });
        }else{
            return res.status(400).json({
                ok: false,
                msg: 'Error en credenciales'
            })
        }

        const validPassword = bcrypt.compareSync( password, user.Clave )
        if( !validPassword ){
            return res.status(400).json({
                ok: false,
                msg: 'Error en credenciales'
            })
        }
         
        // Genera Token
        const token = await generarJWT( user.ID, user.Correo );
        

        const { ID, Rut, Nombre, Empresa, Correo, Estado } = user;

        if(Estado !== 'ACTIVO'){
            return res.status(400).json({
                ok: false,
                msg: 'Por favor hablar con RRHH - blocked user'
            })
        }

        res.json({
            ok: true,
            ID,
            Rut,
            Nombre,
            Empresa,
            Correo,
            Estado,
            token
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
        const { rut, nombre, empresa, correo } = req.body;

        const rutReloj = rut.split('-')[0];

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        const clave = bcrypt.hashSync( rut.substring(0, 4), salt );

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
                                .input('nombre', sql.VarChar, nombre)
                                .input('rutReloj', sql.VarChar, rutReloj)
                                .input('empresa', sql.VarChar, empresa)
                                .input('clave', sql.VarChar, clave)
                                .input('correo', sql.VarChar, correo)
                                .input('estado', sql.VarChar, estado)
                                .query( authQuerys.createNewUser );

        pool.close();

        // Genera Token
        // const token = await generarJWT( rut, correo );

        const { rowsAffected, recordset } = result;

        res.json({
            ok: true,
            idUser: recordset ? recordset[0].ID : 0,
            rowsAffected,
            // token
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

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        const nuevaPassword = bcrypt.hashSync( clave, salt );

        const pool = await getConnection();
        const result = await pool.request()
                                .input('id', sql.Int, id)
                                .input('empresa', sql.VarChar, empresa)
                                .input('clave', sql.VarChar, nuevaPassword)
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



