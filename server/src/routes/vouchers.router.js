const express = require('express');
const router = express.Router();
const vouchersController = require('../controllers/voucher.controller');

//rotte per la gestione dei voucher
router.patch('/update', vouchersController.updateVoucher);
module.exports = router;