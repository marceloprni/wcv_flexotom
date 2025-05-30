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
            let barcodeId = req.params.barcode;

            if (!barcodeId) {
                throw new ModeloInvalidoErro("Campo Barcode vazio.");
            }

            let dadosLote = await vincularLoteService.chamarDadosBarcode(barcodeId);

            res.status(200).json(dadosLote)

        } catch (err) {
            res.status(400).send({ erro: err.message, privilegio1: req.session.user.privilegio, acionaWarmin: false });
        }
    }

    async criarVinculoLote(req, res) {

        try {

        const { LoteId, MateriaPrimaIdInsumo, MateriaPrimaInsumo, Status} = req.body;

        if( !LoteId || !MateriaPrimaIdInsumo || !MateriaPrimaInsumo || !Status) {
            throw new ModeloInvalidoErro("Todos os campos são obrigatórios.");
        }

        let dadosLote = await vincularLoteService.vincularLote(LoteId, MateriaPrimaIdInsumo, MateriaPrimaInsumo, Status);
        
        console.log(dadosLote);
        res.status(200).json(dadosLote);

        } catch (err) {
            res.status(400).send({ erro: err.message, privilegio1: req.session.user.privilegio, acionaWarmin: false });
        }
    }   

}

module.exports = vincularLoteController;