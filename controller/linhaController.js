const {ModeloInvalidoErro, NaoAutorizadoErro } = require("../erros/typeErros");
const linhaService = require('../services/linhaService')

class LinhaController {

    async componentePageComBox(req, res) {
        try {
            const combobox = await linhaService.criarComboBox()
            res.status(200).json(combobox)
        } catch(err) {
            res.status(500).send({
                erro: err.message, priveligo1: req.session.user
            })
        }
    }

    async dadosSelecao(req, res) {
        try {
            const dados = req.params;
            if(!dados.linha || !dados.data || !dados.turno || !dados.linhaValue ) {
                throw new ModeloInvalidoErro(400, "Por favor verificar os dados enviados.")
            }
            const geralDados = await linhaService.criarDadosSelecao(dados.linha, dados.data, dados.turno, dados.linhaValue )
            res.status(200).json(geralDados)
        } catch (err) {
            res.status(500).send({
                erro: err.message, priveligo1: req.session.user
            })
        }
    }

    
}

module.exports = LinhaController