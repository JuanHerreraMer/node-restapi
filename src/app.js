import express from 'express';
import cors from 'cors';
import config from './config';

// Import .routes
import auth from './routes/auth.routes'
import marcas from './routes/marcas.routes'


// crear el servidor de express
const app = express();

// Cors
app.use( cors());

// Directorio Publico
app.use( express.static('public') );

// middlewares // Lectura y parseo del body
app.use( express.json() )
// app.use( express.urlencoded({extended: false}) )

// Use Rutas
app.use('/api/auth', auth );
app.use('/api/registro', marcas );

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// settings
app.set('port', config.port)


export default app