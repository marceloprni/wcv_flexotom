const { Op, Sequelize, QueryTypes} = require("sequelize");
const connection = require('../database/database'); 
const { AplicacaoErro } = require("../erros/typeErros")

function formatDateTime(input) {
    const datePart = input.slice(0,8);
    const timePart = input.slice(8);

    const dia = datePart.slice(0,2);
    const mes = datePart.slice(2,4);
    const ano = datePart.slice(4,8);

    const horas = timePart.slice(0,2);
    const minutos = timePart.slice(2,4);
    const segundos = timePart.slice(4,6);

    return `${ano}-${mes}-${dia}`
}


async function criarDadosSelecaoGerais(data) {
    const dadosDate = formatDateTime(data);
    let absenTeismoGeral;
    let afastamentoGeral;
    let reclamacoesGeral;
    let scrapGeral;

    console.log(dadosDate)
    try {
        
        absenTeismoGeral = await connection.query(`
                SELECT * FROM TAB_CONTROLE_FALTA 
                WHERE DATA = '${dadosDate}'
            `,
            {
                type: QueryTypes.SELECT,
            }) 
        
        afastamentoGeral = await connection.query(`
             SELECT DATA, (DATEDIFF(DAY,DATA,GETDATE())) AS DIFERENCA FROM TAB_ACIDENTES WHERE TIPO = 'COM AFASTAMENTO' ORDER BY DATA DESC;
            `,
            {
                type: QueryTypes.SELECT,
            }) 

        reclamacoesGeral = await connection.query(
            `
                SELECT *
                FROM TAB_RECLAMACOES 
                WHERE DATA <= '${dadosDate}' 
                AND MONTH(DATA) = MONTH(GETDATE());
            `,
            {
                type: QueryTypes.SELECT,
            })

        scrapGeral = await connection.query(
            `
                SELECT *
                FROM relatorio_scrap INNER JOIN MOTIVO_SCRAP ON RSCP_CODIGO_SCRAP = MSCR_CODIGO_SCRAP
                LEFT JOIN SCRAP_VALORES on RSCP_PART_NUMBER = SCV_PN
                AND YEAR(rscp_data) = SCV_ANO AND MONTH(rscp_data) = SCV_MES
                WHERE CONVERT(DATE, RSCP_DATA) = '${dadosDate}'
                AND RSCP_CT NOT IN ('RETRABA','ENGPROD','R.DISPPI','RECEBE','SCRAPLAS')
                AND RSCP_MEDIDA = 'PC';`
            ,
            {
                type: QueryTypes.SELECT,
            })
   
        return {
            absenteismo :  absenTeismoGeral,
            afastamento: afastamentoGeral,
            reclamacoes: reclamacoesGeral,
            scrap: scrapGeral
        }
      
    } catch (err) {
        return AplicacaoErro(500, 'Erro na query produtos ou valor invalido')
    }
    
    // Cálculo de produtividade

}

module.exports = {
    criarDadosSelecaoGerais
}