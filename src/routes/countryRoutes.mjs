import express from 'express'
import { mostrarPaises, mostrarFormularioNuevo, mostrarFormularioEditar, crearPais, editarPais, eliminarPais } from '../controllers/countryController.mjs';

const routerCountries = express.Router();

routerCountries.get('/', mostrarPaises );
routerCountries.post('/', crearPais);
routerCountries.get('/new', mostrarFormularioNuevo);
routerCountries.get('/edit/:id', mostrarFormularioEditar);
routerCountries.post('/:id', editarPais);
routerCountries.delete('/:id', eliminarPais);

export default routerCountries;