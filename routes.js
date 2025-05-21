const express = require('express');
const session = require("express-session");
const router = express.Router();
const { adminAuth, usuarioAuth } = require("./middlewares/adminAuth");
const UsuarioController = require("./controller/usuarioController");
const LinhaController = require("./controller/linhaController")
const LinhaGeralController = require("./controller/linhaGeralController")

const usuarioController = new UsuarioController()
const linhaController = new LinhaController()
const linhaGeralController = new LinhaGeralController()

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


/***************** ROTA RELATORIO GERAL *****************/
/* GET */
router.get("/monitoramento", adminAuth, (req, res) => {
  res.render("monitoramento/monitoramento1", {
      privilegio1: req.session.user.privilegio,
      erro: " ",
      acionaWarmin: true
  });
});

router.get("/monitoramentoselecao/:data", adminAuth, linhaGeralController.dadosSelecaoGerais)

/***************** ROTA RELATORIO LINHA *****************/

router.get("/linha", usuarioAuth, (req, res) => {
  res.render("linha/linhaMonitoramento", {
      privilegio1: req.session.user.privilegio,
      erro: " ",
      acionaWarmin: true
  });
});

router.get("/linhaCombobox", usuarioAuth, linhaController.componentePageComBox)
router.get("/selecaoDados/:linha/:data/:turno/:linhaValue", usuarioAuth, linhaController.dadosSelecao)


module.exports = router