import express from 'express'
import links from '../config/navBarCountryLinks.mjs';
import { obtenerUltimoPais } from '../services/countryService.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  // Obtener el último país y renderizar en la vista principal
  obtenerUltimoPais().then(lastCountry => {
    // Normalizar formatos para la vista (asegurar arrays y plain objects)
    const normalize = (doc) => {
      if (!doc) return null;
      const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
      obj.capital = Array.isArray(obj.capital) ? obj.capital : (obj.capital ? [obj.capital] : []);
      obj.borders = Array.isArray(obj.borders) ? obj.borders : (obj.borders ? [obj.borders] : []);
      obj.timezones = Array.isArray(obj.timezones) ? obj.timezones : (obj.timezones ? [obj.timezones] : []);
      if (obj.languages) {
        try {
          if (obj.languages instanceof Map) obj.languages = Object.fromEntries(obj.languages);
          else if (typeof obj.languages[Symbol.iterator] === 'function') obj.languages = Object.fromEntries(obj.languages);
          else if (typeof obj.languages === 'object') obj.languages = obj.languages;
          else obj.languages = {};
        } catch (e) { obj.languages = obj.languages || {}; }
      } else obj.languages = {};
      if (obj.gini) {
        try {
          if (obj.gini instanceof Map) obj.gini = Object.fromEntries(obj.gini);
          else if (typeof obj.gini[Symbol.iterator] === 'function') obj.gini = Object.fromEntries(obj.gini);
          else if (typeof obj.gini === 'object') obj.gini = obj.gini;
          else obj.gini = {};
        } catch (e) { obj.gini = obj.gini || {}; }
      } else obj.gini = {};
      return obj;
    };

    res.render('index',{
      title: 'Pagina Principal',
      navbarLinks: links,
      lastCountry: normalize(lastCountry)
    });
  }).catch(err => {
    console.error('Error fetching last country:', err);
    res.render('index',{ title: 'Pagina Principal', navbarLinks: links, lastCountry: null });
  });
});

router.get('/about', (req, res) => {
  res.render('about',{
    title: 'Acerca de',
    navbarLinks: links
  });
});

// Ruta de debug para devolver el último país en JSON
router.get('/debug/last', async (req, res) => {
  try {
    const last = await obtenerUltimoPais();
    if (!last) return res.status(404).json({ ok: false, message: 'No hay países' });
    // Normalizar a plain object
    const obj = typeof last.toObject === 'function' ? last.toObject() : { ...last };
    if (obj.languages instanceof Map) obj.languages = Object.fromEntries(obj.languages);
    if (obj.gini instanceof Map) obj.gini = Object.fromEntries(obj.gini);
    return res.json({ ok: true, data: obj });
  } catch (err) {
    console.error('Debug last error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
});

// Manejar el formulario de contacto (no persiste en DB por ahora)
router.post('/contact', (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    // Validación mínima
    if (!name || !email || !message) {
      return res.status(400).render('about', { navbarLinks: links, title: 'Acerca de', errors: [{ field: null, message: 'Completar todos los campos del formulario.' }] });
    }

    // Por ahora solo renderizamos una pantalla de agradecimiento
    return res.render('contact-thanks', { navbarLinks: links, title: 'Gracias', contact: { name, email, message } });
  } catch (err) {
    return res.status(500).render('about', { navbarLinks: links, title: 'Acerca de', errors: [{ field: null, message: 'Ocurrió un error procesando el formulario.' }] });
  }
});

export default router;
