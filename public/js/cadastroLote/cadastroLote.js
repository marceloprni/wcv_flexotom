import  { padraoTable }  from '../../datatableJson/dataTableJs.js';
import { preencherSelect }  from './optionSelect.js';
const DatatbleJson = JSON.stringify(padraoTable);

// VARIAVEIS
var Lote = []
let optionsCarregadas = false; // Variável para controlar o carregamento das opções
var valorSelecionadoId 
var valorSelecionado
var valueInputMateriaprima = document.getElementById('materiaPrimaSelecionada');
var btnCriarLote = document.getElementById('btnCriarLote');

// TABELA
var tableCadastroLote;


/* FUNÇÕES DE INICIOS PARA CARREGAR DADOS */
function createTable() {
    axios.get("/cadastroLote/dadosLote").then(response => {
        console.log(response)
        // Configura o evento de focus uma única vez
        $('#materiaPrima').off('focus').on('focus', function () {
            if (!optionsCarregadas) {
                preencherSelect("materiaPrima", response.data.insumoAtivo);
                optionsCarregadas = true; // garante que carregue só uma vez
            }
        });
        
        for(let b of response.data.loteAtivo){
            Lote.push([b.Lote, b.MateriaPrimaInsumo]);
        }

        console.log(Lote);
        
        tableCadastroLote = jQuery('#tabela-CadastroLote').DataTable(
            {
                pageLength : 4,
                bLengthChange: false,
                bFilter: true,
                data: Lote,
                columns: [{title: "LOTE"}, {title: "DESCRIÇÃO"}],
            });
        
        
        jQuery('#tabela-CadastroLote tbody').on('click', 'tr', function () 
        {
            var tr = jQuery(this).closest('tr');
            var row = tableCadastroLote.row(tr);
            /*Check if row is empty*/
            if (typeof row.data() === 'undefined'){return null;}
            /*Selected row*/
            if (jQuery(this).hasClass('tableSelected')){
                jQuery(this).removeClass('tableSelected');
            }
            else {
                tableCadastroLote.$('tr.tableSelected').removeClass('tableSelected');
                jQuery(this).addClass('tableSelected');
            }   
        });

    }).catch(error => {
        console.log(error);
    });
}


/* FUNÇÕES DE INTERAÇÃO */

document.getElementById("materiaPrima").onchange = function () {
    var campo_select = document.getElementById("materiaPrima");
    valorSelecionadoId = campo_select.options[campo_select.selectedIndex].value;
    valorSelecionado = campo_select.options[campo_select.selectedIndex].text;
    valueInputMateriaprima.placeholder = valorSelecionado;
    campo_select.value = ''; 
};

btnCriarLote.onclick  = function () {
    console.log(valorSelecionadoId, valorSelecionado);
    if (valorSelecionadoId === '' || valorSelecionado === '') {
        alert("Selecione uma matéria-prima válida.");
        return;
    }

    axios.post("/cadastroLote/criarLote", {
        materiaPrimaId: valorSelecionadoId,
        materiaPrimaDescricao: valorSelecionado
    }).then(response => {
                jQuery('#messageDivChildren').css({"background":"#0d6efd", "border": "2px solid #fff", "color": "#fff"});
                jQuery('#message').modal('show');
                jQuery('#messageText').text(response.data.message);
                setTimeout(() => {
                    window.location.reload(); 
                },800);
    }).catch(error => {
            console.error(error);
            const messagem = JSON.parse(error.request.responseText);
            jQuery('#adicionar-modal').modal('hide');
            jQuery('#messageDivChildren').css({"background":"#ffc107", "border": "2px solid #fff"});
            jQuery('#message').modal('show');
            jQuery('#messageText').text(messagem.erro);
    });
};



createTable();