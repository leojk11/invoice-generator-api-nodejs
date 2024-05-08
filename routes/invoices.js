const express = require('express');
const router = express.Router();

const invoices = require('../controllers/invoices');

router.get('/', invoices.getAll);
router.get('/:id', invoices.getSingle);

router.post('/', invoices.addNew);

router.patch('/:id', invoices.update);

router.delete('/:id', invoices.delete);

module.exports = router;