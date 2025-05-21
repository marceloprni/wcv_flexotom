const {ModeloInvalidoErro, NaoAutorizadoErro } = require("../erros/typeErros");
const linhaGeralService = require('../services/linhaGeralService');

class LinhaGeraisController {

    async dadosSelecaoGerais(req, res) {
        try {
            const dados = req.params;
            if(!dados.data) {
                throw new ModeloInvalidoErro(400, "Por favor verificar os dados enviados.")
            }
            const geralDados = await linhaGeralService.criarDadosSelecaoGerais(dados.data)
            res.status(200).json(geralDados)
        } catch (err) {
            res.status(500).send({
                erro: err.message, priveligo1: req.session.user
            })
        }
    }

    
}

module.exports = LinhaGeraisController