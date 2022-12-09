const {User, Profile, Transaction, Cart, Item} = require('../models');
const dateFormatter = require('../helpers/dateFormatter');
const {Op} = require('sequelize');

class AdminController  {
    static showUser(req, res) {
        // console.log(req.session.user)
        const sessionId = req.session.User.id
        User.findAll({
            where: {
                role: 'user'
            },
            include: Profile
        })
        .then(data => {
            res.render('admin-userList', {data, sessionId})
        })
    }

    static showUserDetail(req, res) {
        const sessionId = req.session.User.id
        const {UserId} = req.params

        User.getAllUserDataWithId(UserId)
        .then(data => {
            res.render('admin-checkUser', {data, dateFormatter, sessionId})
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
        const sessionId = req.session.User.id
        const {UserId} = req.params

        Transaction.findOne({
            where: {
                UserId
            },
            include: Item
        })
        .then(data => {
            res.render('admin-checkTransaction', {data, dateFormatter, sessionId})
        })
        .catch(err => {
            res.send(err)
        })
    }

    //! ITEM SECTION

    static showItem(req, res) {
        const sessionId = req.session.User.id
        let name = req.query.name
        if(!name) {
            name = ``
        }
        Item.findAll({
            where: {
                name : {
                    [Op.iLike] : `%${name}%`
                }
        }})
        .then(data => {
            res.render('admin-itemList', {data, sessionId})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static addItemForm(req, res) {
        const sessionId = req.session.User.id
        res.render('admin-addItemForm', {sessionId})
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
        const sessionId = req.session.User.id
        const id = req.params.itemId
        Item.findByPk(id)
        .then(data => {
            res.render('admin-checkItem', {data, dateFormatter, sessionId})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static editItemForm(req, res) {
        const sessionId = req.session.User.id
        const id = req.params.itemId
        Item.findByPk(id)
        .then(data => {
            res.render('admin-editItemForm', {data, sessionId})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static editItemPost(req, res) {
        const id = req.params.itemId
        const {name, category, price, img} = req.body 
        Item.update({name, category, price, img}, {
            where: {
                id
            }
        })
        .then(() => {
            res.redirect(`/admin/item/${id}`)
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