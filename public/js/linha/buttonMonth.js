import { DateTime, DateTimeJunto, Inserir0Date}  from '../timeTratado/timer.js';
import {  calculoFtq, 
          calculoScrap, 
          calculoPecasProduzidas,
          calculoHoraProdutiva,
          calculoParada,
          calculoHoraProduzida,
          calculoTotalScrapPorcentagem,
          somarTodosTarget,
          valueTiraZero,
          valueDay,
          calculoPecasDesejado } from './funcoesCalculo.js';

// DADOS TABELA
let dadosTable = []
// DADOS TARGET 
let dadosTarget = []
// DATA 
let Data = new Date()
let dayAutla = Data.getDate().toString()
// BTN ID SELECIONADO
let idbtnSelect = []
// DADOS DO LOCAL STORAGE
let dataLocalStorage = JSON.parse(localStorage.getItem('dadosLinha'));
console.log(dataLocalStorage)


const mestButton = document.addEventListener('DOMContentLoaded', function() {
    // Função para obter o número de dias no mês
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    }

    // Função para criar botões dos dias
    function createDaysButtons(year, month) {
        const daysContainer = document.getElementById('daysContainerLinha');
        daysContainer.innerHTML = ''; // Limpa o contêiner antes de adicionar os botões

        const daysInMonth = getDaysInMonth(year, month);

        for (let day = 1; day <= daysInMonth; day++) {
            const button = document.createElement('button');
            button.textContent = day;
            button.id = `daylinha-${day}`; 

            button.addEventListener('click', function() {
                // SPINNER 
                jQuery('#spinner').css({"display":"block"});

                // ID BTN SELECIONADO RETIRA A COR DA SELEÇÃO E FAZ UM TRATAMENTO DAS CORES 
                const idSelecionado = this.id

                if(idbtnSelect.length != 0) {
                    const idBtnNumber = idbtnSelect[0];
                    const numberId =  idBtnNumber.split('-')[1]
                    console.log(numberId)
                     if( numberId == dayAutla) {
                        $(`#daylinha-${dayAutla}`).css({"background":"#dc2626", "border": "1px solid white", "color": "white"})
                     } else {
                        $(`#${idbtnSelect[0]}`).css({"background-color":""})
                     }
                } else {
                    if(dataLocalStorage != null) {
                        let btn_day = valueTiraZero((dataLocalStorage.data).substr(0,2))
                        console.log('dia btn')
                        console.log(btn_day)
                        if(btn_day == dayAutla) {
                            $(`#daylinha-${dayAutla}`).css({"background":"#dc2626", "border": "1px solid white", "color": "white"})
                        } else {
                            $(`#daylinha-${btn_day}`).css({"background-color":""})
                        }
                    }
                    $(`#${idbtnSelect[0]}`).css({"background-color":""})
                }
                
                
                // APAGA O LOCALSTORAGE 
                //localStorage.removeItem('dadosLinha');
                //SELECT LINHA
                let campo_select = document.getElementById('selectComboId');
                let valor_select = campo_select.options[campo_select.selectedIndex].textContent;
                let linha_value_select = campo_select.options[campo_select.selectedIndex].value;
                let linha1 = valor_select.split('-',1)
                // SELECT TURNO
                let campo_select_turno = document.getElementById('selecTurnoId');
                let valor_select_turno = campo_select_turno.options[campo_select_turno.selectedIndex].textContent;
                // DATA 
                let data = dataLocalStorage != null ? dataLocalStorage.data :  DateTimeJunto()
                let dayNow = valueDay(button.textContent)  
                let diaAgora = dayNow + data.substr(2)
                // ZERA ARRAY 
                dadosTable.length = 0

                localStorage.setItem('dadosLinha', JSON.stringify({
                    data : diaAgora,
                    linhaValue : campo_select.options[campo_select.selectedIndex].value,
                    linhaInteira : valor_select,
                    linha : linha1[0],
                    turno: valor_select_turno
                }))

                console.log(linha1[0], diaAgora, valor_select_turno, linha_value_select)
                axios.get(`/selecaoDados/${linha1[0]}/${diaAgora}/${valor_select_turno}/${linha_value_select}`,).then(response => { 
                    // BTN CONFIGURANDO COM APÓS SER SELECIONADO.
                    idbtnSelect.length = 0,
                    console.log('segunda leitura'),
                    idbtnSelect.push(idSelecionado),
                    console.log(idbtnSelect),
                    $(`#${idbtnSelect[0]}`).css({"background-color":"#fca5a5"}) 

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
            })

            daysContainer.appendChild(button);
        }
    }

    document.getElementById("enviarDate").addEventListener("click", function() {
        let selectedDate = document.getElementById("dateAtual");
        let partes = selectedDate.value.split("-");
        
        let date = new Date()
        let year = partes[0]
        let month = partes[1]
        let day = partes[2]
        console.log(year, month, day)

        let horas = Inserir0Date(date.getHours())
        let minutos = Inserir0Date(date.getMinutes())
        let segundos = Inserir0Date(date.getSeconds())
        let dados = `${day}${month}${year}${horas}${minutos}${segundos}`
        console.log(dados)

        // MODIFICA O MES CONFORME O MES EDITADO.
        const mesArray = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
        document.getElementById("mesString").innerText = mesArray[Number(month) - 1]
        
        // ADD UMA NOVA DATA NO LOCALSTORAGE
        dataLocalStorage.data = dados

        localStorage.setItem('dadosLinha', JSON.stringify(dataLocalStorage))
        createDaysButtons(year, Number(month) - 1)

        $("#dataModal").modal("hide")
    })

    // Exemplo: criando botões para junho de 2024
    if(dataLocalStorage) {
        let date = dataLocalStorage.data 
        let dataReal = parseInt(valueTiraZero(date.slice(2,4)))
        let year =  parseInt(date.slice(4,8));
        let month = dataReal
        const mesArray = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
        document.getElementById("mesString").innerText = mesArray[dataReal - 1]
        createDaysButtons(year, month);
    } else {
        const year = new Date().getFullYear();
        const month = new Date().getMonth(); // Junho (Janeiro é 0, Fevereiro é 1, etc.)
        const mesArray = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
        document.getElementById("mesString").innerText = mesArray[month]
        createDaysButtons(year, month);
    }
    

});

export {
    mestButton,
    dadosTable,
    dadosTarget
}