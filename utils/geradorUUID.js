const { v4: uuidv4 } = require('uuid');

const uuid = uuidv4();


function gerarUUID(id) {
    let variavel = uuid;
    let variavel2 = variavel.split("-", 3);
    let jsonInformation  = {
        id: variavel,
        idBarcode: (variavel2[0] + variavel2[1]+ variavel2[2] + id.toString())
    }
    return jsonInformation;
}

module.exports = gerarUUID;