
// CALCULO SCRAP
function calculoScrap(valor) {
    let valorTotalScrap = valor.reduce((valor, valorInicial) => {
        return valor + valorInicial.RSCP_QUANTIDADE
   }, 0)
   return valorTotalScrap
}


export {
    calculoScrap,
}