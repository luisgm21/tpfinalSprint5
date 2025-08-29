import express from 'express';
import { connectDB } from './src/config/dbConfig.mjs';
import path from 'path';
import expressLayouts from 'express-ejs-layouts';
import routerCountries from './src/routes/countryRoutes.mjs';
import router from './src/routes/basicRoutes.mjs';




const app = express();
const PORT = process.env.PORT || 3000;

// (debug instrumentation removed)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', path.resolve('./src/views'));

app.use(expressLayouts);
app.set('layout','layout');

app.use(express.static(path.resolve('./src/public')));

connectDB();

app.use('/', router);

app.use('/countries', routerCountries);

app.use((req, res) => {
    res.status(404).send({message: 'Ruta no encontrada'});
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});