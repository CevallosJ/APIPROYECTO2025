const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/preguntas.controller');
const auth = require('../middleware/auth');

// Obtener preguntas por universidad
router.get('/uni/:uniId', ctrl.getByUniversity);

// Crear pregunta
router.post('/', auth, ctrl.create);

// Importar desde Excel
router.post('/import/:uniId', auth, ctrl.importBulk);

// Actualizar pregunta
router.put('/:id', auth, ctrl.update);

// Eliminar pregunta
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
