
function preencherSelect(valueId, dados) {
    const $select = $(`#${valueId}`);
    $select.empty();

    // Adiciona uma opção padrão "Selecione" que não seleciona nada
    $select.append($('<option></option>')
        .val(''));

    dados.forEach(item => {
        const option = $('<option></option>')
            .val(item.id)
            .text(item.Descricao);
        $select.append(option);
    });
}


export {
    preencherSelect
}