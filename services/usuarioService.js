const funcionario = require("../models/funcionario/Funcionario");
const AcessoDashboard = require("../models/acesso_dashboard/AcessoDashboard");
const geradorToken = require("../utils/geradorToken");
const {ModeloInvalidoErro, NaoAutorizadoErro } = require("../erros/typeErros");
const { Op, Sequelize, QueryTypes} = require("sequelize");
const connection = require('../database/database'); 

async function validarUsuarios(usuario, senha) {

    let user =  await connection.query(`
    select fun_registro, fun_codin, dash_tipo 
        from funcionario 
        inner join 
        TAB_ACESSO_DASHBOARD on 
        FUN_REGISTRO = DASH_REGISTRO where FUN_REGISTRO = ${usuario}
    `,
    {
        type: QueryTypes.SELECT,
    })
  
    if( user.length == 0 ||  Number(senha) !== Number(user[0].fun_codin) ){
        throw new NaoAutorizadoErro(401, "Usuário ou senha inválidos");
    } else {
        if(user[0].dash_tipo > 1) {
            let rota = "monitoramento/monitoramento1";
            return {
                rota: rota,
                nome: user[0].fun_registro,
                privilegio: user[0].dash_tipo
            }
        } else {
            let rota = "linha/linhaMonitoramento";
            return {
                rota: rota,
                nome: user[0].fun_registro,
                privilegio: user[0].dash_tipo
            }
        }
        
    }
}

module.exports =  {
    validarUsuarios
}