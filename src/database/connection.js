import sql from 'mssql'
import config from '../config';


const dbSettings = {
    user: config.dbUser,//'sa',
    password: config.dbPassword,//'srv_desarrollo',
    server: config.dbServer,//'localhost',
    //instancename: 'INFORMATICA-JH',
    database: config.dbDataBase,//'webstore',
    options:{
        encrypt: false, //debe ser true si subo API en azure
        trustServerCertificate: true, // change true for local dev
    }
}

export async function getConnection(){
    try {
        const pool = await sql.connect(dbSettings);
        return pool;
    } catch (error) {
        console.log(error);
    }
}

export {sql};