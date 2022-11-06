const express = require('express');

const { createUser, login } = require('./../controllers/users_controller');

const router = express.Router();

router.post('/register', createUser);
router.post('/authenticate', login);

module.exports = router;
