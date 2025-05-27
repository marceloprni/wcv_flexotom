const cadastroLoteService = require('../services/cadastroLoteService');
const { NaoAutorizadoErro, ModeloInvalidoErro } = require('../erros/typeErros');

class cadastroLoteController {

    async dadosLote(req, res) {
        try {
            
            let dadosLote = await cadastroLoteService.dadosParaPage();
            res.status(200).json(dadosLote)

        } catch (err) {
            res.status(400).send({ erro: err.message, privilegio1: req.session.user.privilegio, acionaWarmin: false });
        }
    }

    async criarLote(req, res) {
        try {
            const { materiaPrimaId, materiaPrimaDescricao } = req.body;

            if ( !materiaPrimaId || !materiaPrimaDescricao) {
                throw new ModeloInvalidoErro("Todos os campos são obrigatórios.");
            }

           const salve = await cadastroLoteService.criarLote(materiaPrimaId, materiaPrimaDescricao)


            if(salve) {
                res.status(201).json({ message: "Lote criado com sucesso!" });
            }
            

        } catch (err) {
            res.status(400).send({ erro: err.message, privilegio1: req.session.user.privilegio, acionaWarmin: false });
        }
    }

}

module.exports = cadastroLoteController;