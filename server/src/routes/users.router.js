const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');


//rotte per la gestione degli utenti
router.get('/:id', userController.getUserInfo);
module.exports = router;