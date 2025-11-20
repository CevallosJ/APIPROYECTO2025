const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/calculos.controller');
router.post('/puntaje', ctrl.calcularPuntaje);
module.exports = router;