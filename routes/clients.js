const express = require('express');
const router = express.Router();

const clients = require('../controllers/clients');

router.get('/', clients.getAll);
router.get('/:id', clients.getSingle);

router.post('/', clients.addNew);

router.patch('/:id', clients.update);

router.delete('/:id', clients.delete);

module.exports = router;