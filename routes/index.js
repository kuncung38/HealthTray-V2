const express = require('express')
const router = express.Router()

const adminRouter = require('./admin');

const GeneralController = require('../controllers/generalController')

router.get('/', GeneralController.home)
router.get('/login-register', GeneralController.loginRegister)
router.post('/login', GeneralController.login)
router.post('/register', GeneralController.register)

router.use('/admin', adminRouter)


module.exports = router