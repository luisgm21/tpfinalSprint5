import express from 'express'
import { mostrarPaises, mostrarFormularioNuevo, mostrarFormularioEditar, crearPais, editarPais, eliminarPais } from '../controllers/countryController.mjs';
import { parseJsonPayload, createRules, editRules, handleValidationResult } from '../validators/countryRules.mjs'
import { loadCountriesMiddleware } from './middleware/cargarCountriesMiddleware.mjs'

const routerCountries = express.Router();

routerCountries.get('/', loadCountriesMiddleware, mostrarPaises );
routerCountries.post('/', parseJsonPayload, createRules, handleValidationResult, crearPais);
routerCountries.get('/new', mostrarFormularioNuevo);
routerCountries.get('/edit/:id', mostrarFormularioEditar);
routerCountries.post('/:id', parseJsonPayload, editRules, handleValidationResult, editarPais);
routerCountries.delete('/:id', eliminarPais);

export default routerCountries;