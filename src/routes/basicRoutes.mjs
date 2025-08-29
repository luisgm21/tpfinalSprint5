import express from 'express'
import links from '../config/navBarCountryLinks.mjs';

const router = express.Router();

router.get('/', (req, res) => {
  res.render('index',{
    title: 'Pagina Principal',
    navbarLinks: links
  });
});

export default router;
