import express from 'express'
import links from '../config/navBarCountryLinks.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index',{
    title: 'Pagina Principal',
    navbarLinks: links
  });
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
