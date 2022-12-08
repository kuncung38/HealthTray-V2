const {User, Profile, Transaction, Cart, Item} = require('../models');
const dateFormatter = require('../helpers/dateFormatter');

class AdminController  {
    static showUser(req, res) {
        User.findAll({
            where: {
                role: 'user'
            },
            include: Profile
        })
        .then(data => {
            res.render('admin-userList', {data})
        })
    }

    static showUserDetail(req, res) {
        const {UserId} = req.params

        User.findByPk(UserId, {
            where: {
                role: 'user'
            },
            include: {
                all: true
            }
        })
        .then(data => {
            res.render('admin-checkUser', {data, dateFormatter})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static deleteUser(req, res) {
        const id = req.params.UserId
        User.destroy({
            where: {
                id: id
            }
        })
        .then(() => res.redirect('/admin'))
        .catch(err => {
            res.send(err)
        })
    }

    static showUserTransaction(req, res) {
        const {UserId} = req.params

        Transaction.findOne({
            where: {
                UserId
            },
            include: Item
        })
        .then(data => {
            res.render('admin-checkTransaction', {data, dateFormatter})
        })
        .catch(err => {
            res.send(err)
        })
    }

    //! ITEM SECTION

    static showItem(req, res) {
        Item.findAll()
        .then(data => {
            res.render('admin-itemList', {data})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static addItemForm(req, res) {
        res.render('admin-addItemForm')
    }

    static addItemFormPost(req, res) {
        const {name, category, price, img} = req.body
        
        Item.create({name, category, price, img})
        .then(() => res.redirect('/admin/item'))
        .catch(err => {
            res.send(err)
        })
    }

    static showItemDetail(req, res) {
        const id = req.params.itemId
        Item.findByPk(id)
        .then(data => {
            res.render('admin-checkItem', {data, dateFormatter})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static deleteItem(req, res) {
        const id = req.params.itemId
        Item.destroy({
            where: {
                id: id
            }
        })
        .then(() => res.redirect('/admin/item'))
        .catch(err => {
            res.send(err)
        })
    }
}

module.exports = AdminController