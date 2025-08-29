import { validationResult } from 'express-validator';

// Middleware genérico para manejar errores de validación (adaptado para países)
export const handleValidationCountryErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errArray = errors.array().map(error => ({ field: error.param || error.path, message: error.msg }));

        // Detectar preferencia JSON (API / Postman) o navegador
        const userAgent = req.get('User-Agent') || '';
        const isPostman = userAgent.includes('PostmanRuntime');
        const acceptsJson = (req.headers?.accept || '').includes('application/json');

        if (isPostman || acceptsJson) {
            return res.status(400).json({ ok: false, message: 'Error de validación', errors: errArray });
        }

        // Para peticiones desde navegador, re-renderizar el formulario de país con errores
        const body = req.body || {};
        const country = Object.assign({}, body);
        try { country.languages = body.languages ? Object.entries(body.languages) : []; } catch(e) { country.languages = []; }
        try { country.gini = body.gini ? Object.entries(body.gini) : []; } catch(e) { country.gini = []; }

        return res.status(400).render('formCountry', { country, navbarLinks: req.navbarLinks || [], title: 'Error en formulario', errors: errArray });
    }
    next();
};

// Alias más claro y nombre orientado al proyecto
export const handleValidationErrors = handleValidationCountryErrors;