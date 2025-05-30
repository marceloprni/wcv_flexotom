
let vincularLoteCv = []
let tableVincularLote;


function createTable() {
    axios.get("/vincularLote/dadosLote").then(response => {
        //APAGA DADOS DO ARRAY
        vincularLoteCv = [];
        console.log(response)
        
        for(let b of response.data.loteAtivo){
            vincularLoteCv.push([b.Lote, b.MateriaPrimaInsumo]);
        }
       
        tableVincularLote = jQuery('#tabela-VincularLote').DataTable(
            {
                pageLength : 4,
                bLengthChange: false,
                bFilter: true,
                data: vincularLoteCv,
                columns: [{title: "LOTE"}, {title: "DESCRIÇÃO"}],
                ordering: false
            });
        
        
        jQuery('#tabela-VincularLote tbody').on('click', 'tr', function () 
        {
            var tr = jQuery(this).closest('tr');
            var row = tableVincularLote.row(tr);
            /*Check if row is empty*/
            if (typeof row.data() === 'undefined'){return null;}
            /*Selected row*/
            if (jQuery(this).hasClass('tableSelected')){
                jQuery(this).removeClass('tableSelected');
            }
            else {
                tableVincularLote.$('tr.tableSelected').removeClass('tableSelected');
                jQuery(this).addClass('tableSelected');
            }   
        });

    }).catch(error => {
        console.log(error);
    });
};


createTable();