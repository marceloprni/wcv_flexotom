// SOCKET IO COMUNICAÇÃO
//var socket = io("http://localhost:3400");
import { mestButton } from './buttonMonth.js';
import { DateTimeJunto, valueTiraZero } from '../timeTratado/timer.js'
import { calculoScrap } from './funcoesCalculoMoni.js';

// CRIA O BUTTON.
mestButton
/*********************************** VARIAVEL GLOBAL ***********************************/
let dataLocalStorage = JSON.parse(localStorage.getItem('dadosGeraisLinha')); // LOCAL STORAGE 

const modalPrincial = document.getElementById('modalList'); // MODAL 
const columnFirstId = document.getElementById('LwdcPrimeiraColuna'); // LWDC
const columnSecondId1 = document.getElementById('absenteismoSegundaColuna'); // ABSENTEISMO
const columnSecondId2 = document.getElementById('afastamentoSegundaColuna'); // AFASTAMENTO
const columnSecondId3 = document.getElementById('emprestimoSegundaColuna'); // EMPRÉSTIMO
const columnSecondId4 = document.getElementById('feriasSegundaColuna'); // FERIAS
const columnThreeId1 = document.getElementById('contencaoTerceiraColuna'); // CONTENÇÃO
const columnThreeId2 = document.getElementById('reclamacoesTerceiraColuna'); // RECLAMAÇÕES
const columnThreeId3 = document.getElementById('scrapTerceiraColuna'); // SCRAP
const columnFourId1 = document.getElementById('aderenciaQuartaColuna'); // ADERENCIA
const columnFiveId1 = document.getElementById('oeePrensaQuintaColuna'); // OEE PRENSA
const columnFiveId2 = document.getElementById('oeeInjecaoQuintaColuna'); // OEE INJEÇÃO
const columnFiveId3 = document.getElementById('prodAcMesQuintaColuna'); // PROD AC DO MES
const columnFiveId4 = document.getElementById('prodAcDiaQuintaColuna'); // PROD AC DO DIA
const columnFiveId5 = document.getElementById('setupQuintaColuna'); // SETUP
const columnSixId1 = document.getElementById('cincoSSextaColuna'); // 5S
const columnSixId2 = document.getElementById('media5sSextaColuna'); // MEDIA DE NOTAS 5S
const columnSixId3 = document.getElementById('auditoriaSextaColuna'); // AUDITORIA
const columnSixId4 = document.getElementById('pendentesSextaColuna'); // PENDENTES

const dataAtual = new Date()



/*********************************** FUNÇÕES DE INICIALIZAÇÃO ***********************************/

// REALIZAR LEITURA DO LOCAL STORAGE QUANDO REINICIAR A PAGINA
function ReliazarLeituraUltimoValor() {
    // SPNDLE
    jQuery('#spinner').css({"display":"block", "margin-left": "10px"});

    // VARIAVEL
    let data_linha_ls
    let dataLinha = DateTimeJunto()

    if(dataLocalStorage === null) {
        data_linha_ls = dataLinha
        localStorage.setItem('dadosGeraisLinha', JSON.stringify({
            data : data_linha_ls
        }))

    } else {
        let btn_color = (dataLocalStorage.data).substr(0,2)
        let btn_dayon = valueTiraZero(btn_color)
        console.log(typeof btn_dayon)
        if(btn_dayon == dataAtual.getDate()) {  
            $(`#day-${btn_dayon}`).css({"background":"#dc2626", "border": "1px solid white", "color": "white"})
        } else {
            $(`#day-${btn_dayon}`).css({"background-color":"#fca5a5"}) 
        }
        data_linha_ls = dataLocalStorage.data
    }

    axios.get(`/monitoramentoselecao/${data_linha_ls}`,).then(response => {
        console.log(response.data)
        let dados = response.data
        let absenteismo = dados.absenteismo.length
        let afastamento = dados.afastamento.length
        let reclamacoes = dados.reclamacoes.length
        let scrap = calculoScrap(dados.scrap)
        console.log(scrap)

        // ABSENTEISMO
        document.getElementById('absenteismoText').textContent = absenteismo
        // AFASTAMENTO
        document.getElementById('afastamentoText').textContent = afastamento
        // RECLAMAÇÕES S
        document.getElementById('reclamacoesText').textContent = reclamacoes
        // SCRAP
        document.getElementById('scrapText').textContent = scrap
        // SPINNER 
        jQuery('#spinner').css({"display":"none"});
    
    }).catch(err => {
        console.log(err)
        const messagem = JSON.parse(err.request.responseText);
        jQuery('#setup').modal('hide');
        jQuery('#messageDivChildren').css({"background":"#ffc107", "border": "2px solid #fff"});
        jQuery('#message').modal('show');
        jQuery('#messageText').text(messagem.erro);
    })


}


/*********************************** MODAL ***********************************/

/* PRIMEIRA COLUNA */
jQuery(columnFirstId).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})


/* SEGUNDA COLUNA */

jQuery(columnSecondId1).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnSecondId2).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnSecondId3).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnSecondId4).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

/* TERCEIRA COLUNA */

jQuery(columnThreeId1).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnThreeId2).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnThreeId3).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

/* QUARTA COLUNA */

jQuery(columnFourId1).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

/* QUINTA COLUNA */

jQuery(columnFiveId1).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnFiveId2).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnFiveId3).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnFiveId4).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnFiveId5).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

/* SEXTA COLUNA */

jQuery(columnSixId1).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnSixId2).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnSixId3).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

jQuery(columnSixId4).on("click", function createListcolumnFirstId() {
    $(modalPrincial).modal('show')
    //axios.get(`/producao1/producaoOperando/${1}/${true}`).then(response => {
    //    const data = response.data
    //
    //});
    
})

/*********************************** EVENTO QUANDO FECHAR O MODAL  ***********************************/

// ZERA TODOS OS VALORES DA TABELA DO MODAL
jQuery('#modalList').on('hidden.bs.modal', function() {
    // ZERA TODA A TABELA QUANDO FECHAR O MODAL
    //table.destroy()
    //jQuery('#tabela_linha').DataTable({}).destroy();
    //jQuery('#tabela_linha').DataTable({destroy: true}).destroy();
    location.reload()
})

/*********************************** INICIALIZAÇÃO DAS FUNÇÕES ***********************************/

setTimeout(() => {
    ReliazarLeituraUltimoValor()
}, 500)
