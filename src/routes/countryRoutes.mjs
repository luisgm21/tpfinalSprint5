import express from 'express'
import { mostrarPaises } from '../controllers/countryController.mjs';

const routerCountries = express.Router();

routerCountries.get('/', mostrarPaises )

export default routerCountries;