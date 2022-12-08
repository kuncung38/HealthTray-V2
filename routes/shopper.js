const express = require('express')
const ShopperController = require('../controllers/shopperController')
const router = express.Router()

router.get('/', ShopperController.shop)
router.get('/cart/:TransactionId', ShopperController.cart)
router.get('/:TransactionId/addToCart/:ItemId', ShopperController.addToCart)

module.exports = router