const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/universidades.controller');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', ctrl.getAll);
router.post('/', auth, admin, ctrl.create);
router.put('/:id', auth, admin, ctrl.update);
router.delete('/:id', auth, admin, ctrl.remove);

module.exports = router;
