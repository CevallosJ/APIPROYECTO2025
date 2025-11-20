const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/simulador.controller');
const auth = require('../middleware/auth');
router.post('/guardar', auth, ctrl.saveIntento);
router.get('/historial/uni/:uniId', auth, ctrl.getHistorial);
router.get('/historial/admin/:uniId', auth, ctrl.getHistorialAdmin);
module.exports = router;