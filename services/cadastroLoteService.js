const Lote = require("../models1/Lote/Lote");
const Insumos = require("../models/Insumos/Insumos");
const gerarUUID = require("../utils/geradorUUID");
const {ModeloInvalidoErro, NaoAutorizadoErro } = require("../erros/typeErros");
const { Op, Sequelize, QueryTypes} = require("sequelize");


async function dadosParaPage() {

    let lote = await Lote.findAll({
        attributes: ['Lote', 'MateriaPrimaIdInsumo', 'MateriaPrimaInsumo', 'Barcode'],
    });
    let insumos = await Insumos.findAll({
        attributes: ['id', 'Descricao'],
        where: {
            Status: 'A',
        }
    });  

    if(!lote && !insumos) {
        return {
          lote: [],
          Insumos: [],
        };
    } else {
        return {
            loteAtivo: lote,
            insumoAtivo: insumos
        };
    }


}

async function criarLote(materiaPrimaId, materiaPrima) {

    const geradorId = gerarUUID(materiaPrimaId);

    if (!materiaPrimaId || !materiaPrima) {
        throw new ModeloInvalidoErro("Todos os campos são obrigatórios.");
    }

    const salve = await Lote.create({
        Lote: geradorId.id,
        MateriaPrimaIdInsumo: Number(materiaPrimaId),
        MateriaPrimaInsumo: materiaPrima,
        Barcode: geradorId.idBarcode
    });
    
    return salve
}

module.exports =  {
    dadosParaPage,
    criarLote
}