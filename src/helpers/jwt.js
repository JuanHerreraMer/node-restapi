import jwt from 'jsonwebtoken';

export const generarJWT = ( id, correo ) => {

    return new Promise( (resolve, reject) => {
        const payload = { id , correo };

        jwt.sign( payload, process.env.SECRET_JWT_SEED, {
            expiresIn: 300 
        }, (err, token) => {
            if( err ){
                console.log(err);
                reject('No se pudo generar el token')
            }
            resolve( token );
        } )

    } )

}