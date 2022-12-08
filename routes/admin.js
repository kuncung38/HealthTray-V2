const express = require('express')
const AdminController = require('../controllers/adminController')
const router = express.Router()


router.get('/', AdminController.showUser)
router.get('/user/:UserId', AdminController.showUserDetail)
router.get('/user/:UserId/delete', AdminController.deleteUser)
router.get('/user/:UserId/transaction', AdminController.showUserTransaction)
router.get('/item', AdminController.showItem)
router.get('/addItem', AdminController.addItemForm)
router.post('/addItem', AdminController.addItemFormPost)
router.get('/item/:itemId', AdminController.showItemDetail)
router.get('/item/:itemId/edit', AdminController.editItemForm)
router.post('/item/:itemId/edit', AdminController.editItemPost)
router.get('/item/:itemId/delete', AdminController.deleteItem)

module.exports = router