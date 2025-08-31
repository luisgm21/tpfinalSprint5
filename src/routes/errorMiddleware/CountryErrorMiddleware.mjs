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

    // No aplicar Object.entries sobre strings (provoca descomposición por caracter).
    // Dejamos los campos tal cual vinieron del formulario; la vista es responsable
    // de mostrar strings, objetos o maps correctamente.
    country.languages = body.languages || '';
    country.gini = body.gini || '';

    // Determinar si estamos en modo 'create' o 'edit' según existencia de id en params
    const mode = req.params && req.params.id ? 'edit' : 'create';
    if (mode === 'create') delete country._id; // evitar que el template piense que es edición

    const title = mode === 'create' ? 'Agregar país' : 'Editar país';
    return res.status(400).render('formCountry', { country, navbarLinks: req.navbarLinks || [], title, mode, errors: errArray });
    }
    next();
};

// Alias más claro y nombre orientado al proyecto
export const handleValidationErrors = handleValidationCountryErrors;