import Country from '../../models/country.mjs';

// Middleware para cargar países y adjuntarlos a req.countries
export const cargarSuperHeroesMiddleware = async (req, res, next) => {
    try {
        const countries = await Country.find();
        req.countries = countries;
        next();
    } catch (error) {
        console.error('Error cargando países:', error);
        return res.status(500).render('ChartCountry', {
            countries: [],
            error: 'Error al cargar países'
        });
    }
};

// Alias con nombre significativo
export const loadCountriesMiddleware = cargarSuperHeroesMiddleware;