// Carregando módulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')
const app = express();
const admin = require('./routes/admin')
const usuarios = require('./routes/usuario')
const path = require('path');
const mongoose = require('./config/db')
const passport = require("passport")
require("./config/auth")(passport);
const session = require('express-session')
const flash = require('connect-flash')

require("./models/Postagem")
const Postagem = mongoose.model("postagens");

require("./models/Categoria")
const Categoria = mongoose.model("categorias");

// Configurações
    // Sessão
    app.use(session({
        secret: 'Teste@2020!',
        resave: true,
        saveUninitialized: true
    }))

    // Passport
    app.use(passport.initialize());
    app.use(passport.session());

    // Flash
    app.use(flash())

    // Middleware
    app.use( (req, res, next) => {
        res.locals.success_msg = req.flash("success_msg")
        res.locals.error_msg = req.flash("error_msg")
        res.locals.error = req.flash("error")
        res.locals.user = req.user || null
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
app.get('/', (req, res) => {
    Postagem.find().populate("categoria").sort({data: "desc"}).lean().then((postagens) => {
        res.render("index",  {postagens: postagens});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404");
    })
});

app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) => {
        if(postagem) {
            res.render("postagem/index", {postagem: postagem})
        } else {
            req.flash("error_msg", "Esta postagem não existe");
            res.redirect("/")
        }

    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno");
        res.redirect("/")
    })
});

app.get("/categorias", (req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("categorias/index", {categorias: categorias})
    }).catch((error) => {
        req.flash("error_msg", "Houve um erro interno ao listar as categorias");
        res.redirect("/");
    })
});

app.get("/categorias/:slug", (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if (categoria) {
            Postagem.find({categoria: categoria._id}).sort({data: "desc"}).lean().then((postagens) => {
                res.render("categorias/postagens", {postagens: postagens, categoria: categoria});
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar o sposts");
                res.redirect("/");
            });
        } else {
            req.flash("error_msg", "Esta categoria não existe");
            res.redirect("/");
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno");
        req.redirect("/");
    });
});

app.get("/404", (req, res) => {
    res.send("Erro/404");
});

app.use('/admin', admin)
app.use("/usuarios", usuarios)

// Outros
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando...http://localhost:${PORT}`))