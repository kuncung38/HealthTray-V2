const express = require('express')
const router = require('./routes');
const session = require('express-session')
const app = express()

const port = 3000



app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}))

app.use(session({
    secret: 'kesendirian itu melelahkan',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        sameSite: true
    }
}))

app.use('/', router)


app.listen(port, () => {
    console.log(`HealthTrayV2 listening on port ${port}`)
})