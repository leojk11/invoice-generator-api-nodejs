const express = require('express');
const router = express.Router();

const users = require('../controllers/users');

router.get('/', users.getAll);
router.get('/:id', users.getSingle);

router.post('/', users.addNew);

router.patch('/:id', users.update);

router.delete('/:id', users.delete);

module.exports = router;