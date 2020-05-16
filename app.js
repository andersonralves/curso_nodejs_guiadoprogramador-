// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require('./routes/admin')
const path = require('path');
const mongoose = require('./config/db')
const session = require('express-session')
const flash = require('connect-flash')

// Configurações
    // Sessão
    app.use(session({
        secret: 'Teste@2020!',
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    // Middleware
    app.use( (req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        next()
    })

    // Body Parser
    app.use(bodyParser.urlencoded({extended: true}))
    app.use(bodyParser.json())
    // Handlebars
    app.engine('handlebars', handlebars({defaultLayout: 'main'}))
    app.set('view engine', 'handlebars')
    // Public
    app.use(express.static(path.join(__dirname, 'public')))

    // Exemple Middleware
    app.use( (req, res, next) => {
        //console.log('EU SOU UM MIDDLEWARE')
        next();
    })

// Rotas
app.use('/admin', admin)

// Outros
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando...http://localhost:${PORT}`))