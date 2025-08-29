import links from '../config/navBarCountryLinks.mjs';
import {obtenerPaises , obtenerPaisPorId , agregarPais , editarPais , eliminarPais} from '../services/countryService.mjs'

export const mostrarPaises = async (req, res) => {
    try {
        const countries = await obtenerPaises();
        res.render('ChartCountry', { countries , navbarLinks: links , title: 'Paises' });
    } catch (error) {
        res.render('ChartCountry', { countries: [], error: error.message });
    }
};