const express = require('express');
const router = express.Router();

const companies = require('../controllers/company');

router.get('/', companies.getAll);
router.get('/:id', companies.getSingle);

router.post('/', companies.addNew);

router.patch('/:id', companies.update);

router.delete('/:id', companies.delete);

module.exports = router;