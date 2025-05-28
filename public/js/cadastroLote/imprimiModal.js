function imprimirModal(idModal) {
   const conteudoModal = document.getElementById(`${idModal}`).innerHTML;
  const novaPagina = window.open();

  novaPagina.document.write(`
    <html>
    <head>
      <title>Imprimir Modal</title>
      <style>
        /* Adicione estilos específicos se necessário */
        body { 
        font-family: Arial, 
        sans-serif; margin: 20px; 
        }
         
        #btn_imprimir_barcode {
            display: none;
        }
        
      </style>
    </head>
    <body>
      ${conteudoModal}
    </body>
    </html>
  `);

  novaPagina.document.close();

  // Aguarde o carregamento do conteúdo e imprima
  novaPagina.onload = function() {
    novaPagina.focus();
    novaPagina.print();
    // opcionalmente fechar a aba após a impressão
    // novaPagina.close();
  };
}

export {
    imprimirModal
}