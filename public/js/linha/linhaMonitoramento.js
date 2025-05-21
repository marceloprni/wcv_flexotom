import { DateTime, DateTimeJunto }  from '../timeTratado/timer.js';
import { mestButton, dadosTable, dadosTarget} from './buttonMonth.js';
import { padraoTable } from '../../datatableJson/dataTableJs.js'; 
import { calculoFtq, 
        calculoScrap, 
        calculoPecasProduzidas,
        calculoHoraProdutiva,
        calculoParada,
        calculoHoraProduzida,
        calculoTotalScrapPorcentagem,
        somarTodosTarget,
        valueTiraZero,
        calculoPecasDesejado } from './funcoesCalculo.js';

// DESCRIÇÃO TABELA          
const DataTableJson = JSON.stringify(padraoTable);

// AQUI TAMBEM CONSTA ROTA PARA SELECIONAR CONFORME O DIA NECESSARIO.
mestButton

/*********************************** VARIAVEIS  ***********************************/

// TABLE 
var table
// MODAL 
const modalPrincial = document.getElementById('modalList');
const modalData = document.getElementById("dataModal")
const modalTexto = document.getElementById('exampleModalLabel');

//COMBOBOX LINHA
let selectComboLinha = document.getElementById("selectComboId")
//DADOS COMBOBOX
let dadosCombo
// DATA 
let diaAtual = new Date();
let dayAutla = diaAtual.getDate().toString()
// DADOS LOCAL STORAGE 
let dataLocalStorage = JSON.parse(localStorage.getItem('dadosLinha'));
console.log(dataLocalStorage)

// CHECK 
let checkAtiva = document.getElementById("checkAuto")
let checkSetInterval


/*********************************** FUNÇÕES DE INICIALIZAÇÃO ***********************************/

// CRIA O COMBOBOX DA PAGINA
function criarComboBox(){
     axios.get(`/linhaCombobox`).then(response => {
        dadosCombo = response.data
        dadosCombo.forEach(element => {
            let optionElement = document.createElement("option")
            optionElement.value =  element.LIN_CODIGO_LINHA
            optionElement.textContent =`${element.LIN_CT}${element.LIN_MAQUINA}-${element.LIN_NOME_LINHA}`
            //if(element.value) {
            //    optionElement.selected = true;
            //} 
            selectComboLinha.appendChild(optionElement)
            // DETERMINA A COR VERMELHE PARA O DIA DO MES NO BTN.
            $(`#daylinha-${dayAutla}`).css({"background":"#dc2626", "border": "1px solid white", "color": "white"})
        })
    }).catch(err => {
        console.log(err)
        const messagem = JSON.parse(err.request.responseText);
        jQuery('#setup').modal('hide');
        jQuery('#messageDivChildren').css({"background":"#ffc107", "border": "2px solid #fff"});
        jQuery('#message').modal('show');
        jQuery('#messageText').text(messagem.erro);
    })
}

// REALIZAR LEITURA DO LOCAL STORAGE QUANDO REINICIAR A PAGINA
function ReliazarLeituraUltimoValor() {
    // SPNDLE
    jQuery('#spinner').css({"display":"block"});
    // DIA BTN PARA COLOCAR A COR SE MUDAR A DATA DO DIA 
    let btn_color
    // VARIAVEL PARA PREENCHER VALORES PARA JOGAR NA ROTA 
    let valor_linha_lido
    let valor_turno_lido
    let valor_data_lido
    let valor_linhaValue
    //SELECT LINHA
    let campo_select = document.getElementById('selectComboId');
    let valor_select = campo_select.options[campo_select.selectedIndex].textContent;
    let linha1 = valor_select.split('-',1)
    let linha_value_select = campo_select.options[campo_select.selectedIndex].value;
    // SELECT TURNO
    let campo_select_turno = document.getElementById('selecTurnoId');
    let valor_select_turno = campo_select_turno.options[campo_select_turno.selectedIndex].textContent;
    
    let dataLinha = DateTimeJunto()
    // ZERA ARRAY 
    dadosTable.length = 0

    // VERIFICAR SE TEM ARQUIVO NO 
    if(dataLocalStorage === null) {
        
        valor_linha_lido = linha1[0]
        valor_data_lido = dataLinha
        valor_linhaValue = linha_value_select
        valor_turno_lido = valor_select_turno
        localStorage.setItem('dadosLinha', JSON.stringify({
            data : dataLinha,
            linhaValue : campo_select.options[campo_select.selectedIndex].value,
            linhaInteira : valor_select,
            linha : linha1[0],
            turno: valor_select_turno
        }))

    } else {
        btn_color = (dataLocalStorage.data).substr(0,2)
        const btn_dayon = valueTiraZero(btn_color)
        if(btn_dayon == dayAutla) {
            console.log('color de realizar linha ultimo valor')
            $(`#daylinha-${btn_dayon}`).css({"background":"#dc2626", "border": "1px solid white", "color": "white"})
        } else {
            $(`#daylinha-${btn_dayon}`).css({"background-color":"#fca5a5"}) 
        }

        campo_select.value  = dataLocalStorage.linhaValue
        campo_select_turno.value = dataLocalStorage.turno
        valor_linha_lido = dataLocalStorage.linha
        valor_data_lido = dataLocalStorage.data
        valor_linhaValue = dataLocalStorage.linhaValue
        valor_turno_lido = dataLocalStorage.turno

    }

    console.log(linha1[0], dataLinha, valor_select_turno, linha_value_select)
    axios.get(`/selecaoDados/${valor_linha_lido}/${valor_data_lido}/${valor_turno_lido}/${valor_linhaValue}`,).then(response => {

        let dados = response.data
        console.log(dados)
        // ALIMENTAR OS VALORES DO ARRAY COM DADOS VOLTADO EM JSON
        dadosTable.push(dados)
        //// VARIAVEIS DO JSON TRATADO 
        const absenteismo = dados.absenteismo.length
        const diasSemAcidente = dados.calculoDosDiasSemAcidente[0].DIFERENCA
        const ftq = calculoFtq(dados.calculoDeFtq)
        const scrap = calculoScrap(dados.calculoScrap)
        const scrapPorcentagem = calculoTotalScrapPorcentagem(dados.calculoScrap, dados.calculoProdutividade)
        const scrapPorcentagem2 =  isNaN(scrapPorcentagem) ? 0 : scrapPorcentagem;
        const pecasProduzidas = calculoPecasProduzidas(dados.calculoProdutividade)
        const pecasDesejada = calculoPecasDesejado(dados.calculoProdutividade)
        const reclamacoes = dados.calculoDeReclamacoes.length
        const produtividade = calculoHoraProdutiva(dados.calculoProdutividade) 
        const paradaProgramada = calculoParada(dados.paradaProgramada)
        const paraaNaoProgramada = calculoParada(dados.paradaNaoProgramada)
        const horaProduzidas = calculoHoraProduzida(dados.calculoHoraProduzida)
        const oeeGeral = dados.calculoEficiencia[0].OEE
        const linhaProduzindo = dados.informacaoProd[0].LIN_SITUACAO
        const linhaStatus = dados.informacaoProd[0].MOTIVO

        //// TARGET 
        somarTodosTarget(dados.target)
        const scrapTarget =  dadosTarget[0].find(item => item[0] == 'SCRAP') ?? 0 
        const targetValue =  scrapTarget[1] ?? 0
        ///* TRATAMENTO CSS */
        produtividade >= 85.0 ? 
        jQuery('#idcolumnFourLineEficiencia').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineEficiencia').css({"background-color":"#ff1427"});
        
        Number(paradaProgramada) <= 3.0 ? 
        jQuery('#idcolumnFourLineParadaPGR').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineParadaPGR').css({"background-color":"#ff1427"});
        
        Number(paraaNaoProgramada) <= 0.0 ? 
        jQuery('#idcolumnFourLineParadaNaoPGR').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineParadaNaoPGR').css({"background-color":"#ff1427"});
        
        if(scrapPorcentagem2 <= targetValue) {
            jQuery('#idcolumnSecondLineSCRAP').css({"background-color":"#28A745"})
            jQuery('#idcolumnSecondLineSCRAPpPM').css({"background-color":"#28A745"})
        } else {
            jQuery('#idcolumnSecondLineSCRAP').css({"background-color":"#ff1427"}) 
            jQuery('#idcolumnSecondLineSCRAPpPM').css({"background-color":"#ff1427"})
        }

        oeeGeral >= 80 ?
        jQuery('#idcolumnThreeLineEficiencia').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnThreeLineEficiencia').css({"background-color":"#ff1427"});

        pecasProduzidas >= pecasDesejada ? 
        jQuery('#idcolumnThreeLinePCproduzidas').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnThreeLinePCproduzidas').css({"background-color":"#ff1427"});

        linhaProduzindo == 'PRODUZINDO' ?
        jQuery('#statusLinhas').css({"background-color":"#28A745"}) 
        : jQuery('#statusLinhas').css({"background-color":"#ff1427"});

        /* TARGET VALORES */
        // SCRAP % TARGET
        document.getElementById('paragrafoTargetSCRAPporcentagem').textContent = 'TARGET' + ' ' + targetValue + '%'
        document.getElementById('paragrafoTargetPCproduzidas').textContent = 'TARGET' + ' ' + pecasDesejada.toFixed(2) 

        /* VALORES PARA JOGAR NO PARAGRAFO. */
        // ABSENTEISMO
        document.getElementById('absenteismoValor').textContent = absenteismo
        // CALCULO DE DIAS SEM ACIDENTE
        document.getElementById('calculoDiasSemAcidente').textContent =  diasSemAcidente
        // CALCULO DE FTQ
        document.getElementById('calculoFTQ').textContent = ftq
        // CALCULO DE SCRAP 
        document.getElementById('calculoScrap').textContent = scrap
        // CACCULO DE SCRAP %
        document.getElementById('calculoScrapPorcentagem').textContent = scrapPorcentagem2+'%'
        // CALCULO DE PEÇAS PRODUZIDAS 
        document.getElementById('calculoPCproduzidas').textContent = pecasProduzidas
        // CALCULA A QUANTIDADE DE RECLAMAÇÕES
        document.getElementById('calculoReclamacoes').textContent = reclamacoes
        // CALCULO DE PRODUTIVIDADE
        document.getElementById('calculoProdutividade').textContent = produtividade+'%'
        // CALCULO DE PARADA PROGRAMADA 
        document.getElementById('calculoParadaProgramada').textContent = paradaProgramada
        // CALCULO DE PARADA NÃO PROGRAMADA 
        document.getElementById('calculoParadaNaoProgramada').textContent = paraaNaoProgramada
        // CALULO DE HORA GERADAS 
        document.getElementById('calculoHproduzidas').textContent = horaProduzidas
        // CALCULO DE OEE
        document.getElementById('calculoEficiencia').textContent = oeeGeral+'%'
        // STATUS 
        document.getElementById('statusLinhas').textContent = linhaProduzindo == 'PRODUZINDO' ? 'PRODUZINDO' : linhaStatus
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


/*********************************** FUNÇÕES  ***********************************/

// SELEÇÃO LINHA
document.getElementById('selectComboId').onchange = function(){
    // SPNDLE
    jQuery('#spinner').css({"display":"block"});
    // SET O LOCAL STORAGE
    localStorage.removeItem('dadosLinha');
    //SELECT LINHA
    let campo_select = document.getElementById('selectComboId');
    let valor_select = campo_select.options[campo_select.selectedIndex].textContent;
    let linha1 = valor_select.split('-',1)
    let linha_value_select = campo_select.options[campo_select.selectedIndex].value;
    // SELECT TURNO
    let campo_select_turno = document.getElementById('selecTurnoId');
    let valor_select_turno = campo_select_turno.options[campo_select_turno.selectedIndex].textContent;
    // DATA 
    let dataLinha = DateTimeJunto()

    // ZERA ARRAY 
    dadosTable.length = 0

    // ADD VALOR NO LOCALSTORAGE
    localStorage.setItem('dadosLinha', JSON.stringify({
        data : dataLinha,
        linhaValue : campo_select.options[campo_select.selectedIndex].value,
        linhaInteira : valor_select,
        linha : linha1[0],
        turno: valor_select_turno
    }))
    console.log(linha1[0], dataLinha, valor_select_turno, linha_value_select)
    axios.get(`/selecaoDados/${linha1[0]}/${dataLinha}/${valor_select_turno}/${linha_value_select}`,).then(response => {
        let dados = response.data
        console.log(dados)
        // ALIMENTAR OS VALORES DO ARRAY COM DADOS VOLTADO EM JSON
        dadosTable.push(dados)
        // VARIAVEIS DO JSON TRATADO 
        const absenteismo = dados.absenteismo.length
        const diasSemAcidente = dados.calculoDosDiasSemAcidente[0].DIFERENCA
        const ftq = calculoFtq(dados.calculoDeFtq)
        const scrap = calculoScrap(dados.calculoScrap)
        const scrapPorcentagem = calculoTotalScrapPorcentagem(dados.calculoScrap, dados.calculoProdutividade)
        const scrapPorcentagem2 =  isNaN(scrapPorcentagem) ? 0 : scrapPorcentagem;
        const pecasProduzidas = calculoPecasProduzidas(dados.calculoProdutividade)
        const pecasDesejada = calculoPecasDesejado(dados.calculoProdutividade)
        const reclamacoes = dados.calculoDeReclamacoes.length
        const produtividade = calculoHoraProdutiva(dados.calculoProdutividade) 
        const paradaProgramada = calculoParada(dados.paradaProgramada)
        const paraaNaoProgramada = calculoParada(dados.paradaNaoProgramada)
        const horaProduzidas = calculoHoraProduzida(dados.calculoHoraProduzida)
        const oeeGeral = dados.calculoEficiencia[0].OEE
        const linhaProduzindo = dados.informacaoProd[0].LIN_SITUACAO
        const linhaStatus = dados.informacaoProd[0].MOTIVO
  
        // TARGET 
        somarTodosTarget(dados.target)
        const scrapTarget =  dadosTarget[0].find(item => item[0] == 'SCRAP') ?? 0 
        const targetValue =  scrapTarget[1] ?? 0
        /* TRATAMENTO CSS */
        produtividade >= 85.0 ? 
        jQuery('#idcolumnFourLineEficiencia').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineEficiencia').css({"background-color":"#ff1427"});
        
        Number(paradaProgramada) <= 3.0 ? 
        jQuery('#idcolumnFourLineParadaPGR').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineParadaPGR').css({"background-color":"#ff1427"});
        
        Number(paraaNaoProgramada) <= 0.0 ? 
        jQuery('#idcolumnFourLineParadaNaoPGR').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineParadaNaoPGR').css({"background-color":"#ff1427"});
        
        if(scrapPorcentagem2 <= targetValue) {
            jQuery('#idcolumnSecondLineSCRAP').css({"background-color":"#28A745"})
            jQuery('#idcolumnSecondLineSCRAPpPM').css({"background-color":"#28A745"})
        } else {
            jQuery('#idcolumnSecondLineSCRAP').css({"background-color":"#ff1427"}) 
            jQuery('#idcolumnSecondLineSCRAPpPM').css({"background-color":"#ff1427"})
        }

        oeeGeral >= 80 ?
        jQuery('#idcolumnThreeLineEficiencia').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnThreeLineEficiencia').css({"background-color":"#ff1427"});

        pecasProduzidas >= pecasDesejada ? 
        jQuery('#idcolumnThreeLinePCproduzidas').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnThreeLinePCproduzidas').css({"background-color":"#ff1427"});

        linhaProduzindo == 'PRODUZINDO' ?
        jQuery('#statusLinhas').css({"background-color":"#28A745"}) 
        : jQuery('#statusLinhas').css({"background-color":"#ff1427"});


        /* TARGET VALORES */
        // SCRAP % TARGET
        document.getElementById('paragrafoTargetSCRAPporcentagem').textContent = 'TARGET' + ' ' + targetValue + '%'
        document.getElementById('paragrafoTargetPCproduzidas').textContent = 'TARGET' + ' ' + pecasDesejada.toFixed(2) 


        /* VALORES PARA JOGAR NO PARAGRAFO. */
        // ABSENTEISMO
        document.getElementById('absenteismoValor').textContent = absenteismo
        // CALCULO DE DIAS SEM ACIDENTE
        document.getElementById('calculoDiasSemAcidente').textContent =  diasSemAcidente
        // CALCULO DE FTQ
        document.getElementById('calculoFTQ').textContent = ftq
        // CALCULO DE SCRAP 
        document.getElementById('calculoScrap').textContent = scrap
        // CACCULO DE SCRAP %
        document.getElementById('calculoScrapPorcentagem').textContent = scrapPorcentagem2+'%'
        // CALCULO DE PEÇAS PRODUZIDAS 
        document.getElementById('calculoPCproduzidas').textContent = pecasProduzidas
        // CALCULA A QUANTIDADE DE RECLAMAÇÕES
        document.getElementById('calculoReclamacoes').textContent = reclamacoes
        // CALCULO DE PRODUTIVIDADE
        document.getElementById('calculoProdutividade').textContent = produtividade+'%'
        // CALCULO DE PARADA PROGRAMADA 
        document.getElementById('calculoParadaProgramada').textContent = paradaProgramada
        // CALCULO DE PARADA NÃO PROGRAMADA 
        document.getElementById('calculoParadaNaoProgramada').textContent = paraaNaoProgramada
        // CALULO DE HORA GERADAS 
        document.getElementById('calculoHproduzidas').textContent = horaProduzidas
        // CALCULO DE OEE
        document.getElementById('calculoEficiencia').textContent = oeeGeral+'%'
        // STATUS 
        document.getElementById('statusLinhas').textContent = linhaProduzindo == 'PRODUZINDO' ? 'PRODUZINDO' : linhaStatus
        // SPNDLE
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

// SELEÇÃO TURNO
document.getElementById('selecTurnoId').onchange = function(){
    // SPNDLE
    jQuery('#spinner').css({"display":"block"});
    // SET O LOCAL STORAGE
    localStorage.removeItem('dadosLinha');
    //SELECT LINHA
    let campo_select = document.getElementById('selectComboId');
    let valor_select = campo_select.options[campo_select.selectedIndex].textContent;
    let linha1 = valor_select.split('-',1)
    let linha_value_select = campo_select.options[campo_select.selectedIndex].value;
    // SELECT TURNO
    let campo_select_turno = document.getElementById('selecTurnoId');
    let valor_select_turno = campo_select_turno.options[campo_select_turno.selectedIndex].textContent;
    // DATA 
    let dataLinha = DateTimeJunto()

    // ZERA ARRAY 
    dadosTable.length = 0

    // ADD VALOR NO LOCALSTORAGE
    localStorage.setItem('dadosLinha', JSON.stringify({
        data : dataLinha,
        linhaValue : campo_select.options[campo_select.selectedIndex].value,
        linhaInteira : valor_select,
        linha : linha1[0],
        turno: valor_select_turno
    }))
    console.log(linha1[0], dataLinha, valor_select_turno, linha_value_select)
    axios.get(`/selecaoDados/${linha1[0]}/${dataLinha}/${valor_select_turno}/${linha_value_select}`,).then(response => {
       let dados = response.data
        console.log(dados)
        // ALIMENTAR OS VALORES DO ARRAY COM DADOS VOLTADO EM JSON
        dadosTable.push(dados)
        // VARIAVEIS DO JSON TRATADO 
        const absenteismo = dados.absenteismo.length
        const diasSemAcidente = dados.calculoDosDiasSemAcidente[0].DIFERENCA
        const ftq = calculoFtq(dados.calculoDeFtq)
        const scrap = calculoScrap(dados.calculoScrap)
        const scrapPorcentagem = calculoTotalScrapPorcentagem(dados.calculoScrap, dados.calculoProdutividade)
        const scrapPorcentagem2 =  isNaN(scrapPorcentagem) ? 0 : scrapPorcentagem;
        const pecasProduzidas = calculoPecasProduzidas(dados.calculoProdutividade)
        const pecasDesejada = calculoPecasDesejado(dados.calculoProdutividade)
        const reclamacoes = dados.calculoDeReclamacoes.length
        const produtividade = calculoHoraProdutiva(dados.calculoProdutividade) 
        const paradaProgramada = calculoParada(dados.paradaProgramada)
        const paraaNaoProgramada = calculoParada(dados.paradaNaoProgramada)
        const horaProduzidas = calculoHoraProduzida(dados.calculoHoraProduzida)
        const oeeGeral = dados.calculoEficiencia[0].OEE
        const linhaProduzindo = dados.informacaoProd[0].LIN_SITUACAO
        const linhaStatus = dados.informacaoProd[0].MOTIVO
  
        // TARGET 
        somarTodosTarget(dados.target)
        const scrapTarget =  dadosTarget[0].find(item => item[0] == 'SCRAP') ?? 0 
        const targetValue =  scrapTarget[1] ?? 0
        /* TRATAMENTO CSS */
        produtividade >= 85.0 ? 
        jQuery('#idcolumnFourLineEficiencia').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineEficiencia').css({"background-color":"#ff1427"});
        
        Number(paradaProgramada) <= 3.0 ? 
        jQuery('#idcolumnFourLineParadaPGR').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineParadaPGR').css({"background-color":"#ff1427"});
        
        Number(paraaNaoProgramada) <= 0.0 ? 
        jQuery('#idcolumnFourLineParadaNaoPGR').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnFourLineParadaNaoPGR').css({"background-color":"#ff1427"});
        
        if(scrapPorcentagem2 <= targetValue) {
            jQuery('#idcolumnSecondLineSCRAP').css({"background-color":"#28A745"})
            jQuery('#idcolumnSecondLineSCRAPpPM').css({"background-color":"#28A745"})
        } else {
            jQuery('#idcolumnSecondLineSCRAP').css({"background-color":"#ff1427"}) 
            jQuery('#idcolumnSecondLineSCRAPpPM').css({"background-color":"#ff1427"})
        }

        oeeGeral >= 80 ?
        jQuery('#idcolumnThreeLineEficiencia').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnThreeLineEficiencia').css({"background-color":"#ff1427"});

        pecasProduzidas >= pecasDesejada ? 
        jQuery('#idcolumnThreeLinePCproduzidas').css({"background-color":"#28A745"}) 
        : jQuery('#idcolumnThreeLinePCproduzidas').css({"background-color":"#ff1427"});

        linhaProduzindo == 'PRODUZINDO' ?
        jQuery('#statusLinhas').css({"background-color":"#28A745"}) 
        : jQuery('#statusLinhas').css({"background-color":"#ff1427"});


        /* TARGET VALORES */
        // SCRAP % TARGET
        document.getElementById('paragrafoTargetSCRAPporcentagem').textContent = 'TARGET' + ' ' + targetValue + '%'
        document.getElementById('paragrafoTargetPCproduzidas').textContent = 'TARGET' + ' ' + pecasDesejada.toFixed(2)  


        /* VALORES PARA JOGAR NO PARAGRAFO. */
        // ABSENTEISMO
        document.getElementById('absenteismoValor').textContent = absenteismo
        // CALCULO DE DIAS SEM ACIDENTE
        document.getElementById('calculoDiasSemAcidente').textContent =  diasSemAcidente
        // CALCULO DE FTQ
        document.getElementById('calculoFTQ').textContent = ftq
        // CALCULO DE SCRAP 
        document.getElementById('calculoScrap').textContent = scrap
        // CACCULO DE SCRAP %
        document.getElementById('calculoScrapPorcentagem').textContent = scrapPorcentagem2+'%'
        // CALCULO DE PEÇAS PRODUZIDAS 
        document.getElementById('calculoPCproduzidas').textContent = pecasProduzidas
        // CALCULA A QUANTIDADE DE RECLAMAÇÕES
        document.getElementById('calculoReclamacoes').textContent = reclamacoes
        // CALCULO DE PRODUTIVIDADE
        document.getElementById('calculoProdutividade').textContent = produtividade+'%'
        // CALCULO DE PARADA PROGRAMADA 
        document.getElementById('calculoParadaProgramada').textContent = paradaProgramada
        // CALCULO DE PARADA NÃO PROGRAMADA 
        document.getElementById('calculoParadaNaoProgramada').textContent = paraaNaoProgramada
        // CALULO DE HORA GERADAS 
        document.getElementById('calculoHproduzidas').textContent = horaProduzidas
        // CALCULO DE OEE
        document.getElementById('calculoEficiencia').textContent = oeeGeral+'%'
        // STATUS 
        document.getElementById('statusLinhas').textContent = linhaProduzindo == 'PRODUZINDO' ? 'PRODUZINDO' : linhaStatus


        // SPNDLE
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

/*********************************** MODAL DO COMBOBOX ***********************************/

// CARREGA O MODAL E MAIS A TABELA COM AS INFORMAÇÕES DO JSON DAS INFORMAÇÕES DO ABSENTEISMO
jQuery('#idcolumnFirstLineAB').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'ABSENTEÍSMO'
        var tableObjeto = []
        // REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].absenteismo){
            tableObjeto.push([b.REGISTRO, b.NOME]);
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ {title: "REGISTRO", width: "50%"}, {title: "NOME", width: "50%"}]
            });
        $(modalPrincial).modal('show')

    }
    
    
})

// CARREGA O MODAL E MAIS A TABELA COM AS INFORMAÇÕES DO JSON DAS INFORMAÇÕES DO DIAS SEM ACIDENTES
jQuery('#idcolumnFirstLineDSA').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'DIAS SEM ACIDENTES'
        var tableObjeto = []
        // REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoDosDiasSemAcidente){
             tableObjeto.push([DateTime(b.DATA), b.DIFERENCA]);
        }
    
        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ {title: "DATA", width: "50%"}, {title: "DEFERENÇA", width: "50%"}]
            });
        $(modalPrincial).modal('show')
    }
    
    
})

// CARREGA O MODAL INFORMAÇÕES SOBRE A TABELA FTQ
jQuery('#idcolumnSecondLineFTQ').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'FTQ'
        var tableObjeto = []
        // REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoDeFtq){
            const CtMq = ((b.CT).toString() + (b.MAQUINA).toString())
            tableObjeto.push([b.PARTNUMBER, CtMq, b.QTD]);
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ {title: "PARTNUMBER", width: "40%"}, {title: "CT-MAQUINA", width: "40%"}, {title: "QTD", width: "20%"}]
            });
        $(modalPrincial).modal('show')
    }
})

// CARREGA O MODAL INFORMAÇÕES SOBRE SCRAP
jQuery('#idcolumnSecondLineSCRAP').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'SCRAP'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoScrap){
            const CtMq = ((b.RSCP_CT).toString() + (b.RSCP_MAQUINA).toString())
            tableObjeto.push([
                b.RSCP_CODIGO_SCRAP, 
                b.MSCR_DESCRICAO, 
                b.RSCP_PART_NUMBER,
                CtMq,
                b.RSCP_QUANTIDADE,
                b.RSCP_MEDIDA
            ]);
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "CODIGO SCRAP", width: "20%" }, 
                    {title: "DESCRIÇÃO", width: "20%"}, 
                    {title: "PART-NUMBER", width: "20%"}, 
                    {title: "CT-MAQUINA", width: "12%"}, 
                    {title: "QTD", width: "10%"}, 
                    {title: "MEDIDA", width: "10%"}, 
                ]
            });
        $(modalPrincial).modal('show')
    }
   
    
})

// CARREGA O MODAL INFORMAÇÕES SOBRE SCRAP PORCENTAGEM
jQuery('#idcolumnSecondLineSCRAPpPM').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'SCRAP'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoScrap){
            const CtMq = ((b.RSCP_CT).toString() + (b.RSCP_MAQUINA).toString())
            tableObjeto.push([
                b.RSCP_CODIGO_SCRAP, 
                b.MSCR_DESCRICAO, 
                b.RSCP_PART_NUMBER,
                CtMq,
                b.RSCP_QUANTIDADE,
                b.RSCP_MEDIDA
            ]);
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "CODIGO SCRAP", width: "20%" }, 
                    {title: "DESCRIÇÃO", width: "20%"}, 
                    {title: "PART-NUMBER", width: "20%"}, 
                    {title: "CT-MAQUINA", width: "12%"}, 
                    {title: "QTD", width: "10%"}, 
                    {title: "MEDIDA", width: "10%"}, 
                ]
            });
        $(modalPrincial).modal('show')
    }
})

// CARREGA O MODAL SOBRE O TOTAL DE RECLAMAÇÕES
jQuery('#idcolumnSecondLineReclamacoes').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'RECLAMAÇÕES'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoDeReclamacoes){
            const time = DateTime(b.DATA)
            tableObjeto.push([
                b.LINHA,
                b.DESCRICAO,
                time,
                b.REGISTRO_APONTADOR
            ])
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "LINHA", width: "25%" }, 
                    {title: "DESCRIÇÃO", width: "25%"}, 
                    {title: "DATA", width: "25%"}, 
                    {title: "REGISTRO APONTADOR", width: "25%"} 
                ]
            });
        $(modalPrincial).modal('show')
    }
    
    
})

// CARREGA O MODAL DE PEÇAS PRODUZIDAS 
jQuery('#idcolumnThreeLinePCproduzidas').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'PEÇAS PRODUZIDAS'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoProdutividade){
            tableObjeto.push([
                b.CT, 
                b.DATA, 
                b.HH,
                b.MAQUINA,
                b.PLANEJADO,
                b.PRODUZIDO,
                b.PRO_PART_NUMBER
            ]);
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "CT", width: "10%" }, 
                    {title: "DATA", width: "10%"}, 
                    {title: "HH", width: "10%"}, 
                    {title: "MAQUINA", width: "10%"}, 
                    {title: "PLANEJADO", width: "20%"},
                    {title: "PRODUZIDO", width: "20%"},
                    {title: "PRO PART NUMBER", width: "20%"}, 
                ]
            });
        $(modalPrincial).modal('show')
    }
    
    
})

// CARREGA O MODAL COM TOTAL DA EFICIENCIA 

/*
jQuery('#idcolumnThreeLineEficiencia').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        $(modalPrincial).modal('show')
    }
    
}) 
*/

// CARREGA O MODAL DE EFICIENCIA 

jQuery('#idcolumnFourLineEficiencia').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'PRODUTIVIDADE'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoProdutividade){
            const CtMq = ((b.CT).toString() + (b.MAQUINA).toString())
            tableObjeto.push([
                CtMq,
                b.PRO_PART_NUMBER,
                b.DATA,
                b.HH,
                b.PLANEJADO,
                b.PRODUZIDO,
                b.PRO_PART_NUMBER,
                b.TOTAL_HORAS_PARADAS
            ]);
        }
        console.log(tableObjeto)

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "CT-MAQUINA", width: "10%" }, 
                    {title: "PART NUMBER", width: "20%"}, 
                    {title: "DATA", width: "10%"}, 
                    {title: "HORAS", width: "10%"},
                    {title: "PLANEJADO", width: "12%"}, 
                    {title: "PRODUZIDO", width: "12%"},
                    {title: "PART NUMBER", width: "10%"}, 
                    {title: "TOTAL HORAS PARADAS", width: "10%"},
                ]
            });
        $(modalPrincial).modal('show')
    }
    
    
})

// CARREGA O MODAL DE HORA PRODUZIDAS 
jQuery('#idcolumnFourLineHproduzidas').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'HORAS GERADAS'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].calculoHoraProduzida){
            tableObjeto.push([
                b.Barcode,
                b.CT_MAQ,
                b.Codigo_Ordem,
                b.Data,
                b.FLAG_QAD,
                b.HORAS_GERADAS_OP10,
                b.HORAS_GERADAS_OP_5,
                b.Nome,
                b.Nome_Linha,
                b.Part_Number,
                b.Quantidade,
                b.Registro,
                b.Status
            ])
        }

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "BARCODE" }, 
                    {title: "CT-MAQ"}, 
                    {title: "CODIGO ORDEM"},
                    {title: "DATA"},
                    {title: "FLAG QAD"},
                    {title: "H. GERADAS OP10"},
                    {title: "H. GERADAS OP5"},
                    {title: "NOME"},
                    {title: "NOME LINHA"},
                    {title: "PART NUMBER"},
                    {title: "QUANTIDADE"},
                    {title: "REGISTRO"},
                    {title: "STATUS"},
                ]
            });
        $(modalPrincial).modal('show')
    }
    
    
})

// CARREGA O MODAL DE PARADA PROGRAMADA 
jQuery('#idcolumnFourLineParadaPGR').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'PARADA PROGRAMADA'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].paradaProgramada){
            const timeInicial = DateTime(b.RPAR_DATA_INICIO)
            const timeFinal =  DateTime(b.RPAR_DATA_FIM)
            tableObjeto.push([
                timeInicial,
                timeFinal,
                b.DURACAO,
                b.MP_MOTIVO
            ]);
        }
        console.log(tableObjeto)

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "RPAR_DATA_INICIO", width: "30%" }, 
                    {title: "RPAR_DATA_FIM", width: "30%"}, 
                    {title: "DURACAO", width: "20%"},
                    {title: "MOTIVO", with: "20%"}
                ]
            });
        $(modalPrincial).modal('show')
    }
    
    
})

// CARREGA O MODAL DA PARADA NÃO PROGRAMA
jQuery('#idcolumnFourLineParadaNaoPGR').on("click", function(event) {

    var elementoClicado = $(event.target);

    if(elementoClicado.is('button') || elementoClicado.is('p')) {
        document.getElementById("exampleModalLabel").textContent = 'PARADA NÃO PROGRAMADA'
        var tableObjeto = []
        //REALIZAR LEITURA DO ARRAY dadosTables
        for(let b of dadosTable[0].paradaNaoProgramada){
            const timeInicial = DateTime(b.RPAR_DATA_INICIO)
            const timeFinal =  DateTime(b.RPAR_DATA_FIM)
            tableObjeto.push([
                timeInicial,
                timeFinal,
                b.DURACAO,
                b.MP_MOTIVO
            ]);
        }
        console.log(tableObjeto)

        table = jQuery('#tabela_linha').DataTable(
            {
                language: DataTableJson,
                pageLength : 10,
                bLengthChange: false,
                bFilter: true,
                data: tableObjeto,
                autoWidth: false,
                columns: [ 
                    {title: "RPAR_DATA_INICIO", width: "40%" }, 
                    {title: "RPAR_DATA_FIM", width: "40%"}, 
                    {title: "DURACAO", width: "20%"},
                    {title: "MOTIVO", with: "20%"}
                ]
            });
        $(modalPrincial).modal('show')
    }
    
    
})


/*********************************** EVENTO PARA MOSTRAR A DESCRIÇÃO  ***********************************/

jQuery('#idcolmunFirstSkill').on("click", function(event) {
    document.getElementById("exampleModalLabel").textContent = 'SKILLS'
    document.getElementById("descricao_paragrafo").textContent = 'Exibi todas as informações referente aos funcionarios na linha.'
    $(modalPrincial).modal('show') 
})

jQuery('#idcolumnSecondQuality').on("click", function(event) {
    document.getElementById("exampleModalLabel").textContent = 'QUALITY'
    document.getElementById("descricao_paragrafo").textContent = 'Exibi todas as informações referente a qualidade do produto na linha.'
    $(modalPrincial).modal('show') 
})

jQuery('#idcolumnSecondDelivery').on("click", function(event) {
    document.getElementById("exampleModalLabel").textContent = 'DELIVERY'
    document.getElementById("descricao_paragrafo").textContent = 'Exibi todas as informações de produção por linha.'
    $(modalPrincial).modal('show') 
})

jQuery('#idcolumnSecondProd').on("click", function(event) {
    document.getElementById("exampleModalLabel").textContent = 'PRODUCTIVITY'
    document.getElementById("descricao_paragrafo").textContent = 'Exibi todas as informações de produtividade por linha.'
    $(modalPrincial).modal('show') 
})

// MODAL PARA ABRI DATA PARA SELECIONAR O MES E O ANO DESEJADO.
jQuery('#mesString').on("click", function(event) {
    $(modalData).modal('show') 
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

/*********************************** INICIALIZAÇÃO DOS COMBOBOX E OUTRAS CHAMADA DE FUNÇÃO ***********************************/
criarComboBox()
setTimeout(() => {
    ReliazarLeituraUltimoValor()
}, 500)

// ATIVA O MODO AUTOMATICO DE ATUALIZAÇÃO DO SISTEMA 
checkAtiva.addEventListener('change', function(){
    if(this.checked) {
        checkSetInterval = setInterval(()=> {
            ReliazarLeituraUltimoValor()
        }, 60000)
    } else {
        clearInterval(checkSetInterval)
        console.log('off checked')
        
    }
})
