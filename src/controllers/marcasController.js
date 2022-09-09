import { response } from 'express';
import { authQuerys, marcasQuerys, getConnection, sql } from '../database';
import moment from 'moment';

const nameController = 'marcasController'

export const getRegistroMarca = async(req, res = response) => {
    const { id } = req;

    try {
        
        const {rut, fecha, hora} = req.body;

        const pool = await getConnection();
        const result = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('fecha', sql.VarChar, fecha)
            .input('hora', sql.Int, hora)
            .execute( marcasQuerys.sp_MarcasSelect )

        if( result.recordset.length === 0 ){
            return res.status(400).json({
                ok: false,
                msg: `Registro no encontrado, hable con Administrador - Fecha: ${fecha} / Hora: ${hora}`
            })
        }

        res.json({
            ok: true,
            result: result.recordset.reduce((acc)=>{return acc})
        })


    } catch (error) {
        console.log(`${nameController}: [insertRegistroMarca]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con TI - [marcasController]'
        })
    }
}

export const insertRegistroMarca = async(req, res = response) => {

    const { id } = req;
    const date = new Date();   

    try {
        
        const pool = await getConnection();
        const result = await pool.request()
            .input('id', id)
            .query( authQuerys.getUserById );
        
        if( result.recordset.length === 0 ){
            return res.status(400).json({
                ok: false,
                msg: 'Consulte con administrador [insertRegistroMarca - getUserById = 0]'
            })
        }

        const user = result.recordset.reduce( (acc) => {return acc});

        const hora = moment(date).format('HH');
        const minuto = moment(date).format('mm');

        const [ dni, digito ] = user.Rut.split('-');
        const rut = dni+digito;
        const fecha = moment(date).format('YYYYMMDD');
        const horaminuto = (parseInt(hora) * 60) + parseInt(minuto);
        const numReloj = dni;
        const reloj = 'Reloj Control Online';
        const autoriza = 'Administrador';

        const spInsert = await pool.request()
            .input('rut', sql.VarChar, rut)
            .input('fecha', sql.VarChar, fecha)
            .input('hora', sql.VarChar, horaminuto)
            .input('numReloj', sql.VarChar, numReloj)
            .input('reloj', sql.VarChar, reloj)
            .input('autoriza', sql.VarChar, autoriza)
            .input('cuando', sql.VarChar, fecha)
            .execute( marcasQuerys.sp_MarcasInsert );
        
        pool.close();
        
        const { rowsAffected } = spInsert;

        res.json({
            ok: true,
            fecha,
            horaminuto,
            rowsAffected
        })


    } catch (error) {
        console.log(`${nameController}: [insertRegistroMarca]: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con TI - [marcasController]'
        })
    }

}