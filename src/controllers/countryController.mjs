import links from '../config/navBarCountryLinks.mjs';
import { obtenerPaises , obtenerPaisPorId , agregarPais as serviceAgregar , editarPais as serviceEditar , eliminarPais as serviceEliminar } from '../services/countryService.mjs'

export const mostrarPaises = async (req, res) => {
    try {
        const countries = await obtenerPaises();
        // Normalizar países: convertir Maps a objetos planos y asegurar arrays
        const normalizeCountry = (doc) => {
            if (!doc) return null;
            const obj = typeof doc.toObject === 'function' ? doc.toObject() : {...doc};

            // languages: Map -> plain object
            if (obj.languages) {
                try {
                    // Si es un Map nativo de JS
                    if (obj.languages instanceof Map) {
                        obj.languages = Object.fromEntries(obj.languages);
                    }
                    // Si es iterable de pares (Mongoose Map o similar)
                    else if (typeof obj.languages[Symbol.iterator] === 'function') {
                        const pairs = [];
                        for (const entry of obj.languages) {
                            if (Array.isArray(entry) && entry.length >= 2) pairs.push([entry[0], entry[1]]);
                        }
                        if (pairs.length) obj.languages = Object.fromEntries(pairs);
                        else if (typeof obj.languages === 'object') obj.languages = obj.languages;
                        else obj.languages = {};
                    } else if (typeof obj.languages === 'object') {
                        // ya es un plain object
                        obj.languages = obj.languages;
                    } else {
                        obj.languages = {};
                    }
                } catch (e) {
                    obj.languages = obj.languages || {};
                }
            } else {
                obj.languages = {};
            }

            // gini: Map -> plain object
            if (obj.gini) {
                try {
                    if (obj.gini instanceof Map) {
                        obj.gini = Object.fromEntries(obj.gini);
                    } else if (typeof obj.gini[Symbol.iterator] === 'function') {
                        const pairs = [];
                        for (const entry of obj.gini) {
                            if (Array.isArray(entry) && entry.length >= 2) pairs.push([entry[0], entry[1]]);
                        }
                        if (pairs.length) obj.gini = Object.fromEntries(pairs);
                        else if (typeof obj.gini === 'object') obj.gini = obj.gini;
                        else obj.gini = {};
                    } else if (typeof obj.gini === 'object') {
                        obj.gini = obj.gini;
                    } else {
                        obj.gini = {};
                    }
                } catch (e) {
                    obj.gini = obj.gini || {};
                }
            } else {
                obj.gini = {};
            }

            // Asegurar arrays
            obj.capital = Array.isArray(obj.capital) ? obj.capital : (obj.capital ? [obj.capital] : []);
            obj.borders = Array.isArray(obj.borders) ? obj.borders : (obj.borders ? [obj.borders] : []);
            obj.timezones = Array.isArray(obj.timezones) ? obj.timezones : (obj.timezones ? [obj.timezones] : []);

            obj.abr = obj.abr || '';
            return obj;
        };

        const normalized = countries.map(c => normalizeCountry(c));

        // Construir mapa de código (cca3) a nombre para resolver fronteras
        const codeToName = {};
        normalized.forEach(c => {
            if (c && c.abr) codeToName[c.abr] = c.name;
        });

        res.render('ChartCountry', { countries: normalized , navbarLinks: links , title: 'Paises', codeToName });
    } catch (error) {
        res.render('ChartCountry', { countries: [], error: error.message });
    }
};

// Renderiza formulario para crear un nuevo país
export const mostrarFormularioNuevo = (req, res) => {
    try {
        res.render('formCountry', { country: null, navbarLinks: links, title: 'Agregar país' });
    } catch (error) {
        res.status(500).send('Error al mostrar el formulario');
    }
}

// Renderiza formulario para editar un país existente
export const mostrarFormularioEditar = async (req, res) => {
    try {
        const { id } = req.params;
        const countryDoc = await obtenerPaisPorId(id);
        // Normalizar antes de renderizar
        const country = (function(doc){
            if (!doc) return null;
            const obj = typeof doc.toObject === 'function' ? doc.toObject() : {...doc};

            // languages: Map -> plain object (robusto)
            if (obj.languages) {
                try {
                    if (obj.languages instanceof Map) {
                        obj.languages = Object.fromEntries(obj.languages);
                    } else if (typeof obj.languages[Symbol.iterator] === 'function') {
                        const pairs = [];
                        for (const entry of obj.languages) {
                            if (Array.isArray(entry) && entry.length >= 2) pairs.push([entry[0], entry[1]]);
                        }
                        if (pairs.length) obj.languages = Object.fromEntries(pairs);
                        else if (typeof obj.languages === 'object') obj.languages = obj.languages;
                        else obj.languages = {};
                    } else if (typeof obj.languages === 'object') {
                        obj.languages = obj.languages;
                    } else {
                        obj.languages = {};
                    }
                } catch (e) {
                    obj.languages = obj.languages || {};
                }
            } else {
                obj.languages = {};
            }

            // gini: Map -> plain object (robusto)
            if (obj.gini) {
                try {
                    if (obj.gini instanceof Map) {
                        obj.gini = Object.fromEntries(obj.gini);
                    } else if (typeof obj.gini[Symbol.iterator] === 'function') {
                        const pairs = [];
                        for (const entry of obj.gini) {
                            if (Array.isArray(entry) && entry.length >= 2) pairs.push([entry[0], entry[1]]);
                        }
                        if (pairs.length) obj.gini = Object.fromEntries(pairs);
                        else if (typeof obj.gini === 'object') obj.gini = obj.gini;
                        else obj.gini = {};
                    } else if (typeof obj.gini === 'object') {
                        obj.gini = obj.gini;
                    } else {
                        obj.gini = {};
                    }
                } catch (e) {
                    obj.gini = obj.gini || {};
                }
            } else {
                obj.gini = {};
            }

            // Asegurar arrays
            obj.capital = Array.isArray(obj.capital) ? obj.capital : (obj.capital ? [obj.capital] : []);
            obj.borders = Array.isArray(obj.borders) ? obj.borders : (obj.borders ? [obj.borders] : []);
            obj.timezones = Array.isArray(obj.timezones) ? obj.timezones : (obj.timezones ? [obj.timezones] : []);

            obj.abr = obj.abr || '';
            return obj;
        })(countryDoc);

        res.render('formCountry', { country, navbarLinks: links, title: 'Editar país' });
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
}

// Endpoint para crear país (acepta JSON)
export const crearPais = async (req, res) => {
    try {
        // Aceptar tanto objeto como string en languages/gini (p.ej. cuando el formulario envía application/x-www-form-urlencoded)
        const payload = req.body || {};

        const parseLanguages = (val) => {
            if (!val) return {};
            if (typeof val === 'object') return val;
            if (typeof val === 'string') {
                const lines = val.split('\n').map(l=>l.trim()).filter(Boolean);
                const out = {};
                for (const line of lines) {
                    const idx = line.indexOf(':');
                    if (idx === -1) continue;
                    const code = line.slice(0, idx).trim();
                    const name = line.slice(idx + 1).trim();
                    if (code) out[code] = name;
                }
                return out;
            }
            return {};
        };

        const parseGini = (val) => {
            if (!val) return {};
            if (typeof val === 'object') return val;
            if (typeof val === 'string') {
                const lines = val.split('\n').map(l=>l.trim()).filter(Boolean);
                const out = {};
                for (const line of lines) {
                    const idx = line.indexOf(':');
                    if (idx === -1) continue;
                    const year = line.slice(0, idx).trim();
                    const num = Number(line.slice(idx + 1).trim());
                    if (year && !Number.isNaN(num)) out[year] = num;
                }
                return out;
            }
            return {};
        };

        payload.languages = parseLanguages(payload.languages);
        payload.gini = parseGini(payload.gini);

        const nuevo = await serviceAgregar(payload);
        return res.status(201).json({ ok: true, data: nuevo, message: 'País creado correctamente' });
    } catch (error) {
        console.error('crearPais error:', error);
        res.status(500).json({ ok: false, error: 'Ocurrió un error al crear el país. Intenta nuevamente.' });
    }
}

// Endpoint para editar país (acepta JSON)
export const editarPais = async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body || {};

        const parseLanguages = (val) => {
            if (!val) return {};
            if (typeof val === 'object') return val;
            if (typeof val === 'string') {
                const lines = val.split('\n').map(l=>l.trim()).filter(Boolean);
                const out = {};
                for (const line of lines) {
                    const idx = line.indexOf(':');
                    if (idx === -1) continue;
                    const code = line.slice(0, idx).trim();
                    const name = line.slice(idx + 1).trim();
                    if (code) out[code] = name;
                }
                return out;
            }
            return {};
        };

        const parseGini = (val) => {
            if (!val) return {};
            if (typeof val === 'object') return val;
            if (typeof val === 'string') {
                const lines = val.split('\n').map(l=>l.trim()).filter(Boolean);
                const out = {};
                for (const line of lines) {
                    const idx = line.indexOf(':');
                    if (idx === -1) continue;
                    const year = line.slice(0, idx).trim();
                    const num = Number(line.slice(idx + 1).trim());
                    if (year && !Number.isNaN(num)) out[year] = num;
                }
                return out;
            }
            return {};
        };

        body.languages = parseLanguages(body.languages);
        body.gini = parseGini(body.gini);

        const actualizado = await serviceEditar(id, body);
        return res.json({ ok: true, data: actualizado, message: 'País actualizado correctamente' });
    } catch (error) {
        console.error('editarPais error:', error);
        res.status(500).json({ ok: false, error: 'Ocurrió un error al editar el país. Intenta nuevamente.' });
    }
}

// Endpoint para eliminar país
export const eliminarPais = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await serviceEliminar(id);
        res.json({ success: true, deleted: result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}