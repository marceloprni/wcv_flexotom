import { dadosTable, dadosTarget} from './buttonMonth.js';

// CALCULO FTQ
function calculoFtq(valor){
    let valorTotalFTG = valor.reduce((valor, valorInicial) => {
         return valor + valorInicial.QTD
    }, 0)
    return valorTotalFTG
}   

// CALCULO SCRAP
function calculoScrap(valor) {
    let valorTotalScrap = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.RSCP_QUANTIDADE
   }, 0)
   return valorTotalScrap
}

// CALCULO PEÇAS HORA PRODUZIDAS
function calculoPecasProduzidas(valor) {
    let valorTotalScrap = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.PRODUZIDO
   }, 0)
   return valorTotalScrap
}

// CALCULO DAS PEÇAS DESEJADA PARA PRODUÇÃO
function calculoPecasDesejado(valor) {
    let valorTotalScrap = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.PLANEJADO
   }, 0)
   return valorTotalScrap
}

// CALCULO HORA PRODUZIDA
function calculoHoraProdutiva(valor){
    let valorTotalPlanejado = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.PLANEJADO
    }, 0)
    console.log(valorTotalPlanejado)
    let valorTotalProduzido = valor.reduce((valor, valorInicial) => {
    return valor + valorInicial.PRODUZIDO
    }, 0)
    console.log(valorTotalProduzido)
    let valorAll = ((valorTotalProduzido/valorTotalPlanejado) * 100 ).toFixed(2)

    const calculoTotal = isNaN(valorAll) ? 0 : valorAll
    return calculoTotal

}

// CALCULO PARADA
function calculoParada(valor){
    let valorTotal = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.DURACAO
    }, 0)
    return valorTotal.toFixed(2)
}


// CALCULO HORA 
function calculoHoraProduzida(valor) {
    let valorTotal = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.HORAS_GERADAS_OP10
    }, 0)
    return valorTotal.toFixed(2)
}


// CALCULO TOTAL DE PORCENTAGEM DE SCRAP
function calculoTotalScrapPorcentagem(valor1, valor2){
    let valorTotalScrap = valor1.reduce((valor, valorInicial) => {
        return valor + valorInicial.RSCP_QUANTIDADE
   }, 0)
   let valorTotalProduzido = valor2.reduce((valor, valorInicial) => {
    return valor + valorInicial.PRODUZIDO
   }, 0)
   let calculoTotal = valorTotalScrap/valorTotalProduzido
   
   if( calculoTotal == Infinity || calculoTotal == NaN) {
        return 0
   } else {
        return (calculoTotal * 100).toFixed(2)
   }
   
}


// ADD VALOR TARGET DO SCRAP %.
function somarTodosTarget(valor){
    dadosTarget.length = 0;
    let retornoSomaTotal = valor.map((value) => [value.PARAMETRO, value.TARGET])
    console.log(retornoSomaTotal)
    dadosTarget.push(retornoSomaTotal)
}

// TIRAR O ZERO
function valueTiraZero(value) {
    let valorNow = Number(value); 
    if(valorNow < 10) {
        return valorNow.toString()
    } else {
        return value.toString()
    }
}

// COLOCAR 0 NA FRENTE DOS NUMEROS DE 0 - 9
function valueDay(value) {
    let valorNow = Number(value); 
    if(valorNow < 10) {
        return `0${value}`
    } else {
        return value
    }
}

export {
    calculoFtq,
    calculoScrap,
    calculoPecasProduzidas,
    calculoHoraProdutiva,
    calculoParada,
    calculoHoraProduzida,
    calculoTotalScrapPorcentagem,
    somarTodosTarget,
    valueTiraZero,
    valueDay,
    calculoPecasDesejado
}