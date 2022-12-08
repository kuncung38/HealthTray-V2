const bcrypt = require('bcryptjs');
const {User, Profile} = require('../models');

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
            where: {email}
        })
        .then(data=> {
            if(!data) {
                return res.redirect('/login-register?error=login')
            }

            if (bcrypt.compareSync(password, data.password)) {
                if(data.role === `admin`) {
                    res.redirect('/admin')
                } else {
                    res.redirect('/shop')
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
}

module.exports = GeneralController