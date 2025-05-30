const express = require('express');
const session = require("express-session");
const router = express.Router();
const { adminAuth, usuarioAuth } = require("./middlewares/adminAuth");
const UsuarioController = require("./controller/usuarioController");
const CadastroLoteController = require("./controller/cadastroLoteController");
const VincularLoteController = require("./controller/vincularLoteController");

const usuarioController = new UsuarioController()
const cadastroLoteController = new CadastroLoteController()
const vincularLoteController = new VincularLoteController();

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


/***************** CADASTRO DE LOTE *****************/

router.get("/cadastroLote", adminAuth, (req, res) => {
  res.render("cadastroLote/cadastroLote", {
      privilegio1: req.session.user.privilegio,
      erro: " ",
      acionaWarmin: false
  });
}); 

router.get("/cadastroLote/dadosLote", adminAuth, cadastroLoteController.dadosLote);
router.post("/cadastroLote/criarLote", adminAuth, cadastroLoteController.criarLote);
router.delete("/cadastroLote/:deleteLote", adminAuth, cadastroLoteController.deletaLoteUnico);

/***************** VINCULAÇÃO DE LOTE *****************/

router.get("/vincularLote", usuarioAuth, (req, res) => {
  res.render("vinculacaoLote/vinculacaoLote", {
      privilegio1: req.session.user.privilegio,
      erro: " ",
      acionaWarmin: false
  });
}); 

router.get("/vincularLote/dadosLote", usuarioAuth, vincularLoteController.dadosLoteVinculo);
router.get("/vincularLote/:barcode", usuarioAuth, vincularLoteController.barcodeVinculo);
router.post("/vincularLote/:vincularLote", usuarioAuth, vincularLoteController.criarVinculoLote);
router.delete("/vincularLote/:vincularDeleteLote");
/***************** VISUALIZAÇÃO DE LOTE *****************/

router.get("/vizualizarLote", usuarioAuth, (req, res) => {
  res.render("visualizarLote/visualizarLote", {
      privilegio1: req.session.user.privilegio,
      erro: " ",
      acionaWarmin: false
  });
}); 

module.exports = router