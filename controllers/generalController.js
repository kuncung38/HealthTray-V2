const bcrypt = require('bcryptjs');
const {User, Profile, Transaction, Cart, Item} = require('../models');


const PUBLISHABLE_KEY = `pk_test_51MCskiFpI3jvhabIvchMSfjrAEARw7FErPzxw6tr5n6F9yn2A9eYG8sAnTs1wth5QaoZoRbvz64iitimFI260YbJ00YQIAvpQV`
const SECRET_KEY = `sk_test_51MCskiFpI3jvhabIc1672z9W2CWDT1W1nkUPXDoakhpU7Bv4YhKQrYWg0alv90In2WmvD4nwejHdLL6KBpjGe78z00UwzRnNuK`

const stripe = require('stripe')(SECRET_KEY);

class GeneralController {
    static home(req, res) {
        res.render('home')
    }

    static loginRegister(req, res) {
        const {error} = req.query
        res.render('loginRegisterform', {error})
    }

    static login(req, res) {
        const {email, password} = req.body
        User.findOne({
            where: {email},
            include: Profile
        })
        .then(data=> {
            if(!data) {
                return res.redirect('/login-register?error=login')
            }

            if (bcrypt.compareSync(password, data.password)) {
                
                req.session.User = {
                    id: data.id,
                    role: data.role
                }

                if(data.role === `admin`) {
                    res.redirect('/admin')
                } else {
                    if(!data.Profile.address) {
                        res.redirect(`editProfile/${data.id}`)
                    }
                    else {
                        res.redirect('/shopping')
                    }
                }
            } else {
                res.redirect('/login-register?error=login')
            }
        })
        .catch(err => {
            res.send(err)
        })
    }

    static register(req, res) {
        const {fullName, email, password, confirmPassword} = req.body
        if(password !== confirmPassword) {
            return res.redirect('/login-register?error=registerPassword')
        }

        User.create({email, password})
        .then(newuser => {
            return Profile.create({
                fullName,
                UserId: newuser.id
            })
        })
        .then(() => {
            res.redirect('/login-register')
        })
        .catch(err => {
            if(err.name === "SequelizeUniqueConstraintError") {
                res.redirect(`/login-register?error=emailExist`)
            } else {
                res.send(err)
            }
        })
    }

    static editProfile(req, res) {
        const {id} = req.params
        Profile.findOne({
            where: {
                UserId: id
            }
        })
        .then(data => {
            res.render('editProfile', {data})
        })
        .catch(err => {
            res.send(err)
        })
    }

    static editProfilePost(req, res) {
        const {id} = req.params
        const {fullName, address} = req.body
        Profile.update({fullName, address}, 
            {
                where: {
                    UserId: id
                }
            }
        )
        .then(() => {
            if(req.session.User.role === 'admin') {
                res.redirect('/admin')
            } else {
                res.redirect('/shopping')
            }
        })
        .catch(err => {
            res.send(err)
        })
    }

    static checkout (req, res) {
        const {Transaction} = req.session
        res.render('payment', {
            key: PUBLISHABLE_KEY,
            transaction: Transaction
        })

    }

    static checkoutPost(req, res) {
        stripe.customers.create({
            email: req.body.stripeEmail,
            source: req.body.stripeToken,
            name: 'Ricko Wijaya',
            address: {
            line1: 'Jln. Menuju Kebahagiaan',
            postal_code: '696969',
            city: 'Jakarta',
            state: 'UnHealthy',
            country: 'Indonesia',
            }
            })
        .then((customer) => {
            return stripe.charges.create({
                amount: req.session.Transaction.totalPrice * 100, // Charing Rs 25
                description: 'Web Development Product',
                currency: 'IDR',
                customer: customer.id
            });
        })
        .then((charge) => {
            // If no error occurs

            const {id} = req.session.Transaction
            return Transaction.update({isCompleted: true}, {where: {id}})
        })
        .then(() => res.redirect('/'))
        .catch((err) => {
            console.log(err)
            res.send(err) // If some error occurs
        });
    }

    static signout(req, res) {
        delete req.session.User
        if(req.session.Transaction) {
            delete req.session.Transaction
        }
        res.redirect('/')
    }
}

module.exports = GeneralController