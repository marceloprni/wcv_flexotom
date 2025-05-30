const vincularLoteService = require('../services/vincularLoteService');
const { NaoAutorizadoErro, ModeloInvalidoErro } = require('../erros/typeErros');

class vincularLoteController {

    async dadosLoteVinculo(req, res) {
        try {
            
            let dadosLote = await vincularLoteService.dadosParaPage();
            res.status(200).json(dadosLote)

        } catch (err) {
            res.status(400).send({ erro: err.message, privilegio1: req.session.user.privilegio, acionaWarmin: false });
        }
    }

    async barcodeVinculo(req, res) {
        try {
            let { BarcodeIn } = req.body;

            if (!BarcodeIn) {
                throw new ModeloInvalidoErro("Campo Barcode vazio.");
            }

            let dadosLote = await vincularLoteService.chamarDadosBarcode(BarcodeIn);

            res.status(200).json(dadosLote)

        } catch (err) {
            res.status(400).send({ erro: err.message, privilegio1: req.session.user.privilegio, acionaWarmin: false });
        }
    }

    async criarVinculoLote(req, res) {
        
    }

}

module.exports = vincularLoteController;