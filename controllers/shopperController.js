const {User, Transaction, Cart, Item} = require('../models');
const dateFormatter = require('../helpers/dateFormatter');

class ShopperController {
    static shop(req, res) {
        const User = req.session.User
        const UserId = User.id

        let transactionData

        Transaction.findOne({
            where: {
                UserId,
                isCompleted: false
            },
            include: {
                model: Item
            }
        })
        .then(data => {
            if(!data) {
                return Transaction.create({UserId})
                        .then(newTransaction => {
                            return Transaction.findByPk(newTransaction.id, {
                                        include: Item
                                    })
                        })
                        .then(data => {
                            transactionData = data
                            req.session.TransactionId = transactionData.id
                            return Item.findAll()
                        })
            } else {
                transactionData = data
                req.session.Transaction = transactionData
                return Item.findAll()
            }
        })
        .then(items => {
            // res.send(transactionData)
            res.render('shopping', {UserId, transactionData, items})
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }

    static cart(req, res) {
        const User = req.session.User
        const UserId = User.id

        const {TransactionId} = req.params

        let cartData

        Cart.findAll({
            where: {
                TransactionId
            },
            include: {
                model: Item
            }
        })
        .then(data => {
            if(!data) {
                return Cart.create({TransactionId})
                        .then(newCart => {
                            return Cart.findAll({
                                where: {
                                    TransactionId
                                },
                                include: Item
                            })
                        })
                        .then(data => {
                            cartData = data
                            
                            res.render('viewCart', {UserId, cartData})
                        })
            } else {
                cartData = data
                console.log(cartData, '<<<<<<<<<<<<<<<<<<<<')
                res.send(cartData)
                // res.render('viewCart', {UserId, cartData})
            }
        })
        .catch(err => {
            console.log(err)
            res.send(err)
        })
    }

    static addToCart(req, res) {
        const {TransactionId, ItemId} = req.params

        Cart.create({TransactionId, ItemId})
        .then(() => {
            return Transaction.findByPk(TransactionId, {
                include: Item
            })
            
        })
        .then(transactionData => {
            let totalPrice = 0
            transactionData.Items.forEach(item => {
                totalPrice += item.price
            })
            Transaction.update({totalPrice}, {
                where: {id: TransactionId}
            })
        })
        .then(() => res.redirect('/shopping'))
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = ShopperController