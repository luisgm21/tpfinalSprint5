import express from 'express';
import { connectDB } from './src/config/dbConfig.mjs';


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.set('view engine', 'ejs');
app.set('views', './src/views');

connectDB();

app.use((req, res) => {
    res.status(404).send({message: 'Ruta no encontrada'});
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});