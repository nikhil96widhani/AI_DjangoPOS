$.extend($.fn.dataTable.defaults, {
    'serverSide': true,
    'processing': true,
    "language": {
        processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
    },
    orderCellsTop: true,
    "scrollX": true,
    lengthMenu: [[10, 50, 100, 500, 1000, -1], [10, 50, 100, 500, 1000, "All"]],
    order: [],
    dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
        "<'row'<'col-sm-12'tr>>" +
        "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-2'><'col-sm-12 col-md-5'p>>" +
        "<'row'<'col text-right pt-2'B>>",
    buttons: [
        'copy', 'excel', 'print', 'colvis'
    ],
});

$('#toggle-advance-search-button').change(function () {
    if (this.checked) {
        $('#advance-search-bar').removeClass('d-none');
    } else {
        resetAdvanceSearch();
        $('#advance-search-bar').addClass('d-none');
    }
});

function resetAdvanceSearch(table = $('.custom-datatable').DataTable()) {
    for (x of $('#advance-search-bar th input')) {
        $(x).val('');
    }
    table.search('').columns().search('').draw();
}
