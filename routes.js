const express = require('express');
const session = require("express-session");
const router = express.Router();
const { adminAuth, usuarioAuth } = require("./middlewares/adminAuth");
const UsuarioController = require("./controller/usuarioController");

const usuarioController = new UsuarioController()


router.use(session({
  secret: "secret",
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: (60000 * 60) 
  }
}))

/***************** ROTA LOGIN *****************/
router.get("/", (req, res) => { 
  res.render("users/login", { 
    privilegio1: 0,
    erro: " ",
    acionaWarmin: false
  });
});

/* POST */
router.post("/login", usuarioController.login); 
router.get("/logout", usuarioController.logout); 


module.exports = router