const express = require('express')
const router = express.Router()
const bodyparser = require('body-parser')
const adminRouter = require('./admin');
const shopperRouter = require('./shopper');

const GeneralController = require('../controllers/generalController')

router.get('/', GeneralController.home)
router.get('/login-register', GeneralController.loginRegister)
router.post('/login', GeneralController.login)
router.post('/register', GeneralController.register)

router.use(function(req,res,next) {
    if(!req.session.User) {
        res.send(`login dulu plz`)
    } else {
        next()
    }
})

router.get('/editProfile/:id', GeneralController.editProfile)
router.post('/editProfile/:id', GeneralController.editProfilePost)



router.use('/shopping', shopperRouter)

router.use(function(req,res,next) {
    if(req.session.User.role !== 'admin') {
        res.send(`Lah bukan admin, shoo shoo`)
    } else {
        next()
    }
})
router.use('/admin', adminRouter)

router.use(bodyparser.urlencoded({extended:false}))
router.use(bodyparser.json())

router.get('/checkout', GeneralController.checkout)
router.post('/payment', GeneralController.checkoutPost)


module.exports = router