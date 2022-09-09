import express from 'express';
import cors from 'cors';
import config from './config';

// Import .routes
import prod from './routes/products.routes'
import auth from './routes/auth.routes'


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
app.use('/api/webstore', prod );
app.use('/api/auth', auth );

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// settings
app.set('port', config.port)


export default app