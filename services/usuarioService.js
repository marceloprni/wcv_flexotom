const Usuarios = require("../models/Usuarios/Usuarios");
const geradorToken = require("../utils/geradorToken");
const {ModeloInvalidoErro, NaoAutorizadoErro } = require("../erros/typeErros");
const { Op, Sequelize, QueryTypes} = require("sequelize");


async function validarUsuarios(usuario, senha) {

    usuario = usuario.toString().toLowerCase();
    let user = await Usuarios.findOne({where: {Descricao: usuario}});

    //senha = geradorToken.gerarHashDaSenha(senha);

    if(!user || (user.senha !== senha)){
        throw new NaoAutorizadoErro(401, "Usuário ou senha inválidos");
    } else {
        let rota = "pageSelection/pageSelection";
        return {
            id: user.id,
            rota: rota,
            nome: user.nome,
            usuario: user.usuario,
            setor: user.setor,
            privilegio: user.privilegio
        }
    }
}

module.exports =  {
    validarUsuarios
}