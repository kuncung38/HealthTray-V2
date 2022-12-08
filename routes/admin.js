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
router.get('/item/:itemId/delete', AdminController.deleteItem)
// router.get('/:jobId/detail', HiringController.hiringJobDetail)
// router.get('/:jobId/apply', HiringController.hiringApplyJob)
// router.post('/:jobId/apply', HiringController.hiringApplyJobPost)
// router.get(`/:jobId/apply/:applicantId/approve`, HiringController.approve)
// router.get(`/:jobId/apply/:applicantId/reject`, HiringController.reject)

module.exports = router