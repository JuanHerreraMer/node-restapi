import { response } from "express";
import jwt from "jsonwebtoken";

export const validarJWT = (req, res = response, next) => {

    // x-token headers
    const token = req.header('x-token');
    
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }


    try {
        
        const { id, correo } = jwt.verify(token, process.env.SECRET_JWT_SEED);

        req.id = id;
        req.correo = correo;     

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
    }

    next();
    
}