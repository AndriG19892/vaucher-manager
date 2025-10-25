const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shop.controller');

router.post('/create', shopController.createShopList);
router.get('/user/:userId', shopController.getUserShopLists)

module.exports = router;