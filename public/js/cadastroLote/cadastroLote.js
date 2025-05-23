import  { padraoTable }  from '../../../datatableJson/dataTablejs.js';
const DatatbleJson = JSON.stringify(padraoTable);
var tableCadastroLote;

tableCadastroLote = jQuery('#tabela-CadastroLote').DataTable(
            {
                language: DatatbleJson,
                pageLength : 5,
                bLengthChange: false,
                bFilter: true,
                data: [],
                columns: [{title: "N° registro"}, {title: "Nome"}]
            });
            /*Users table row handler*/
jQuery('#tabela-cadastrolote tbody').on('click', 'tr', function () 
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