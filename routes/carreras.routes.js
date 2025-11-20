const express = require('express');
const router = express.Router();

const ctrl = require('../controllers/carreras.controller');
const auth = require('../middleware/auth');

// Rutas carreras
router.get('/', ctrl.getAll);
router.get('/uni/:uniId', ctrl.getByUniversity);
router.post('/', auth, ctrl.create);
router.put('/:id', auth, ctrl.update);
router.delete('/:id', auth, ctrl.remove);

module.exports = router;
