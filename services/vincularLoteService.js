const Lote = require("../models1/Lote/Lote");
const Insumos = require("../models/Insumos/Insumos");
const {ModeloInvalidoErro, NaoAutorizadoErro } = require("../erros/typeErros");
const { Op, Sequelize, QueryTypes} = require("sequelize");


async function dadosParaPage() {

    let lote = await Lote.findAll({
        attributes: ['id', 'Lote', 'MateriaPrimaIdInsumo', 'MateriaPrimaInsumo', 'Barcode'],
        order: [
            ['id', 'DESC']
        ],
        where: {
            Status: 'CV',
        },
    });

    console.log(lote);

    if(!lote) {
        return {
          lote: [],
        };
    } else {
        return {
            loteAtivo: lote,
        };
    }

}

async function chamarDadosBarcode(BarcodeIn) {

    const StatusSv = 'SV';

    if(!BarcodeIn) {
        throw new ModeloInvalidoErro("Campo Barcode vazio.");
    }

    let dadosBarcode = await Lote.findOne({
      attributes: [
        "Lote",
        "MateriaPrimaIdInsumo",
        "MateriaPrimaInsumo",
        "Status",
      ],
      where: {
        Barcode: BarcodeIn,
        Status: StatusSv,
      },
    });

    if(!dadosBarcode) {
        throw new ModeloInvalidoErro("Nenhum dado encontrado para o Barcode informado.");
    }

    return dadosBarcode;

}
 
async function vincularLote(
  BarcodeIn,
  MateriaPrimaIdInsumo,
  MateriaPrimaInsumo,
  Status
) {

    const StatusCv = 'CV';

    if (!BarcodeIn || !MateriaPrimaIdInsumo || !MateriaPrimaInsumo || !Status) {
      throw new ModeloInvalidoErro("Campo Barcode vazio.");
    }

    let dadosTabelaInsumo = await Insumos.findOne({
        attributes: ['id', 'Descricao'],
        where: {
            id: MateriaPrimaIdInsumo
        },
    });

    console.log(dadosTabelaInsumo);

}



module.exports =  {
    dadosParaPage,
    chamarDadosBarcode,
    vincularLote
}