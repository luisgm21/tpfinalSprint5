// Validaciones para country (create y edit)
export function validateCreateCountry(payload) {
    const errors = [];
    const p = payload || {};

    // name (oficial) 3-90 caracteres
    if (!p.name || typeof p.name !== 'string' || p.name.trim().length < 3 || p.name.trim().length > 90) {
        errors.push({ field: 'name', message: 'El nombre oficial debe tener entre 3 y 90 caracteres.' });
    }

    // capital: cada elemento 3-90 caracteres (si existe)
    if (p.capital) {
        if (!Array.isArray(p.capital)) {
            errors.push({ field: 'capital', message: 'Capital debe ser una lista de nombres.' });
        } else {
            p.capital.forEach((c, i) => {
                if (!c || typeof c !== 'string' || c.trim().length < 3 || c.trim().length > 90) {
                    errors.push({ field: 'capital', message: `La capital en la posición ${i + 1} debe tener entre 3 y 90 caracteres.` });
                }
            });
        }
    }

    // borders: cada código 3 letras mayúsculas
    if (p.borders) {
        if (!Array.isArray(p.borders)) {
            errors.push({ field: 'borders', message: 'Fronteras debe ser una lista de códigos (3 letras).' });
        } else {
            const re = /^[A-Z]{3}$/;
            p.borders.forEach((b, i) => {
                if (!b || typeof b !== 'string' || !re.test(b.trim())) {
                    errors.push({ field: 'borders', message: `El código de frontera en la posición ${i + 1} debe ser 3 letras mayúsculas (ej: ARG).` });
                }
            });
        }
    }

    // area: número positivo
    if (p.area !== undefined && p.area !== null) {
        const num = Number(p.area);
        if (Number.isNaN(num) || num <= 0) {
            errors.push({ field: 'area', message: 'Área debe ser un número positivo.' });
        }
    }

    // population: entero positivo
    if (p.population !== undefined && p.population !== null) {
        const num = Number(p.population);
        if (!Number.isInteger(num) || num <= 0) {
            errors.push({ field: 'population', message: 'Población debe ser un entero positivo.' });
        }
    }

    // gini: valores entre 0 y 100
    if (p.gini) {
        if (typeof p.gini === 'object') {
            Object.keys(p.gini).forEach(year => {
                const val = Number(p.gini[year]);
                if (Number.isNaN(val) || val < 0 || val > 100) {
                    errors.push({ field: 'gini', message: `Gini para ${year} debe ser un número entre 0 y 100.` });
                }
            });
        } else {
            errors.push({ field: 'gini', message: 'Gini debe enviarse como pares year:value.' });
        }
    }

    return { ok: errors.length === 0, errors };
}

// Para editar podemos usar las mismas reglas por ahora, pero se deja función separada
export function validateEditCountry(payload) {
    // Podríamos relajar algunas reglas si es parcial, pero aquí aplicamos las mismas comprobaciones
    return validateCreateCountry(payload);
}

// --- Compatibilidad con express-style middlewares ---
import { body } from 'express-validator';
import { handleValidationErrors } from '../routes/errorMiddleware/CountryErrorMiddleware.mjs';

// Parsear __json_payload si viene del formulario y poblar req.body
export function parseJsonPayload(req, res, next) {
    if (req.body && req.body.__json_payload && typeof req.body.__json_payload === 'string') {
        try {
            const parsed = JSON.parse(req.body.__json_payload);
            Object.assign(req.body, parsed);
        } catch (e) {
            // ignore
        }
    }
    next();
}

// express-validator chains que reflejan las reglas existentes
export const createRules = [
    body('name').isString().trim().isLength({ min: 3, max: 90 }).withMessage('El nombre oficial debe tener entre 3 y 90 caracteres.'),
    body('capital').optional().isArray().withMessage('Capital debe ser una lista.'),
    body('capital.*').optional().isString().trim().isLength({ min: 3, max: 90 }).withMessage('Cada capital debe tener entre 3 y 90 caracteres.'),
    body('borders').optional().isArray().withMessage('Fronteras debe ser una lista de códigos.'),
    body('borders.*').optional().isString().matches(/^[A-Z]{3}$/).withMessage('Cada código de frontera debe ser 3 letras mayúsculas.'),
    body('area').optional().isFloat({ gt: 0 }).withMessage('Área debe ser un número positivo.'),
    body('population').optional().isInt({ gt: 0 }).withMessage('Población debe ser un entero positivo.'),
    body('gini').optional().custom(value => {
        if (typeof value !== 'object') throw new Error('Gini debe enviarse como pares year:value.');
        for (const k of Object.keys(value)) {
            const v = Number(value[k]);
            if (Number.isNaN(v) || v < 0 || v > 100) throw new Error(`Gini para ${k} debe ser un número entre 0 y 100.`);
        }
        return true;
    })
];

export const editRules = createRules;

// Re-exportar el handler genérico definido en errorMiddleware para uniformidad
export const handleValidationResult = handleValidationErrors;
