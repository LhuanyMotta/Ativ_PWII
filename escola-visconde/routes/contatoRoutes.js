const express = require('express');
const router = express.Router();
const contatoController = require('../controllers/contatoController');

router.post('/', contatoController.criarContato);
router.get('/', contatoController.listarContatos);

router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API está funcionando corretamente',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;