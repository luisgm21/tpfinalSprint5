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
        // aceptar string o array desde distintos orígenes
        const caps = Array.isArray(p.capital) ? p.capital : (typeof p.capital === 'string' ? p.capital.split(',').map(s=>s.trim()).filter(Boolean) : null);
        if (!caps) {
            errors.push({ field: 'capital', message: 'Capital debe ser una lista de nombres o una cadena separada por comas.' });
        } else {
            caps.forEach((c, i) => {
                if (!c || typeof c !== 'string' || c.trim().length < 3 || c.trim().length > 90) {
                    errors.push({ field: 'capital', message: `La capital en la posición ${i + 1} debe tener entre 3 y 90 caracteres.` });
                }
            });
        }
    }

    // borders: cada código 3 letras mayúsculas (acepta array o string coma-separado)
    if (p.borders) {
        const re = /^[A-Z]{3}$/;
        if (Array.isArray(p.borders)) {
            p.borders.forEach((b, i) => {
                if (!b || typeof b !== 'string' || !re.test(b.trim())) {
                    errors.push({ field: 'borders', message: `El código de frontera en la posición ${i + 1} debe ser 3 letras mayúsculas (ej: ARG).` });
                }
            });
        } else if (typeof p.borders === 'string') {
            const parts = p.borders.split(',').map(s => s.trim()).filter(Boolean);
            parts.forEach((b, i) => {
                if (!re.test(b)) {
                    errors.push({ field: 'borders', message: `El código de frontera en la posición ${i + 1} debe ser 3 letras mayúsculas (ej: ARG).` });
                }
            });
        } else {
            errors.push({ field: 'borders', message: 'Fronteras debe ser una lista de códigos (3 letras) o una cadena separada por comas.' });
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
        // aceptar objeto o string en formato "year:value\n..."
        if (typeof p.gini === 'object') {
            Object.keys(p.gini).forEach(year => {
                const val = Number(p.gini[year]);
                if (Number.isNaN(val) || val < 0 || val > 100) {
                    errors.push({ field: 'gini', message: `Gini para ${year} debe ser un número entre 0 y 100.` });
                }
            });
        } else if (typeof p.gini === 'string') {
            const lines = p.gini.split('\n').map(l=>l.trim()).filter(Boolean);
            lines.forEach(line => {
                const idx = line.indexOf(':');
                if (idx === -1) {
                    errors.push({ field: 'gini', message: 'Formato de Gini inválido. Use year:value por línea.' });
                    return;
                }
                const year = line.slice(0, idx).trim();
                const val = Number(line.slice(idx + 1).trim());
                if (!year || Number.isNaN(val) || val < 0 || val > 100) {
                    errors.push({ field: 'gini', message: `Gini para ${year} debe ser un número entre 0 y 100.` });
                }
            });
        } else {
            // otros tipos no válidos
            errors.push({ field: 'gini', message: 'Gini debe enviarse como pares year:value o como objeto.' });
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
    // capital puede venir como array o string (coma separada)
    body('capital').optional().custom(value => {
        if (Array.isArray(value)) return true;
        if (typeof value === 'string') return true;
        throw new Error('Capital debe ser una lista o una cadena separada por comas.');
    }),
    body('capital.*').optional().isString().trim().isLength({ min: 3, max: 90 }).withMessage('Cada capital debe tener entre 3 y 90 caracteres.'),
    // borders: aceptar array o string (coma separada). Validar que CADA código sea 3 letras mayúsculas (ej: ARG)
    body('borders').optional().custom(value => {
        const re = /^[A-Z]{3}$/;
        if (Array.isArray(value)) {
            for (const v of value) {
                if (typeof v !== 'string' || !re.test(v.trim())) {
                    throw new Error('Cada código de frontera debe ser 3 letras mayúsculas (ej: ARG).');
                }
            }
            return true;
        }
        if (typeof value === 'string') {
            const parts = value.split(',').map(s => s.trim()).filter(Boolean);
            for (const p of parts) {
                if (!re.test(p)) {
                    throw new Error('Cada código de frontera debe ser 3 letras mayúsculas (ej: ARG).');
                }
            }
            return true;
        }
        throw new Error('Fronteras debe ser una lista o una cadena separada por comas.');
    }),
    body('area').optional().isFloat({ gt: 0 }).withMessage('Área debe ser un número positivo.'),
    body('population').optional().isInt({ gt: 0 }).withMessage('Población debe ser un entero positivo.'),
    // timezones puede ser array o string
    body('timezones').optional().custom(value => {
        if (Array.isArray(value)) return true;
        if (typeof value === 'string') return true;
        throw new Error('Timezones debe ser una lista o una cadena separada por comas.');
    }),
    // gini puede ser objeto o string; validar ambos formatos
    body('gini').optional().custom(value => {
        if (typeof value === 'object') {
            for (const k of Object.keys(value)) {
                const v = Number(value[k]);
                if (Number.isNaN(v) || v < 0 || v > 100) throw new Error(`Gini para ${k} debe ser un número entre 0 y 100.`);
            }
            return true;
        }
        if (typeof value === 'string') {
            const lines = value.split('\n').map(l=>l.trim()).filter(Boolean);
            for (const line of lines) {
                const idx = line.indexOf(':');
                if (idx === -1) throw new Error('Formato de Gini inválido. Use year:value por línea.');
                const year = line.slice(0, idx).trim();
                const num = Number(line.slice(idx + 1).trim());
                if (!year || Number.isNaN(num) || num < 0 || num > 100) throw new Error(`Gini para ${year} debe ser un número entre 0 y 100.`);
            }
            return true;
        }
        throw new Error('Gini debe enviarse como pares year:value o como objeto.');
    })
];

export const editRules = createRules;

// Re-exportar el handler genérico definido en errorMiddleware para uniformidad
export const handleValidationResult = handleValidationErrors;
