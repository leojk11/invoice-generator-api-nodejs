const express = require('express');
const router = express.Router();

const invoiceItems = require('../controllers/invoice-items');

router.get('/', invoiceItems.getAll);
router.get('/:id', invoiceItems.getSingle);

router.post('/', invoiceItems.addNew);

router.patch('/:id', invoiceItems.update);

router.delete('/:id', invoiceItems.delete);

module.exports = router;