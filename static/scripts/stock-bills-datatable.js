let stock_bill_id_to_delete;
const dataTable = $("#stock-bills-datatable");

function loadStockBillDetails(order_id, selector) {
    selector.html('Loading...');
    let url = '/api/stock-bill-items/';

    let html = `<table class="table table-sm table-hover table-active">
                  <thead>
                    <tr>
                      <th scope="col" class="font-weight-bolder">#</th>
                      <th scope="col" class="font-weight-bolder">Product Code</th>
                      <th scope="col" class="font-weight-bolder">Product Name</th>
                      <th scope="col" class="font-weight-bolder">Stock</th>
                      <th scope="col" class="font-weight-bolder">Cost (₹)</th>
                      <th scope="col" class="font-weight-bolder">MRP (₹)</th>
                      <th scope="col" class="font-weight-bolder">Final Price (₹)</th>
                      <th scope="col" class="font-weight-bolder">Profit (₹)</th>
                    </tr>
                  </thead>
                <tbody>`;

    $.ajax(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        data: {'order_id': order_id},
        success: function (data) {
            console.log(data);
            let count = 1;
            $.each(data["stock_bill_items"], function (key, value) {
                html += `<tr>
                          <td>${count}</td>
                          <td>${value.product_code}</td>
                          <td>${value.name}</td>
                          <td>${value.stock}</td>
                          <td>${value.cost}</td>
                          <td>${value.mrp}</td>
                          <td>${value.discount_price}</td>
                          <td>${roundToTwoDecimal(value.discount_price - value.cost)}</td>
                        </tr>`;
                count++;
            })
            html += '</tbody></table>';
        },
        error: function () {
            html = 'Could not fetch Stock Bill Details! Please Try Again.'
        },
        complete: function () {
            selector.html(html).slideDown(200);
        }
    });
}

function format() {
    return '<div class="slider text-center" style="display: none">Loading...</div>';
}

function loadStockBillsData(date1, date2) {
    let url = '/api/stock-bills-datatable/?format=datatables';
    if (date1 !== null && date2 !== null) {
        url = `/api/stock-bills-datatable/?format=datatables&date1=${date1}&date2=${date2}`;
    }
    return dataTable.DataTable({
        'ajax': url,
        "fnInitComplete": function () {
            const myCustomScrollbar = document.querySelector('#stock-bills-datatable_wrapper .dataTables_scrollBody');
            const ps = new PerfectScrollbar(myCustomScrollbar);
        },
        "language": {
            "zeroRecords": `<div class="alert alert-warning text-center" role="alert">
                            No stock bills found! 
                           </div>`
        },
        'columns': [
            {
                "class": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function () {
                    return '<span class="badge badge-pill badge-info py-1" type="button"><i class="fas fa-plus"></i></span>'
                }
            },
            {'data': 'id',},
            {
                'data': 'date_ordered',
                render: function (data) {
                    return dateFormat(data, "d mmm yyyy");
                }
            },
            {'data': 'name', render: handleBlankData},
            {'data': 'vendor.name', render: handleBlankData},
            {'data': 'bill_quantity'},
            {'data': 'bill_cost'},
            {'data': 'bill_mrp'},
            {'data': 'bill_revenue'},
            {'data': 'bill_profit'},
            {
                'data': 'id', sortable: false, render: function (data, type, row) {
                    return `<a class=""><i class="fa fa-trash stock-bill-delete" aria-hidden="true" data-toggle="modal" 
                            data-target="#deleteStockBillPrompt" data-stock-bill-id="${data}"></i></a>`;
                }
            },
        ],
    });
}

dataTable.on('click', '.stock-bill-delete', function () {
    stock_bill_id_to_delete = this.getAttribute('data-stock-bill-id');
    $('#static-stock-bill-id-delete').empty().html(stock_bill_id_to_delete);
});

function deleteStockBill() {
    let url = "/api/stock-bill/";

    $.ajax(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify({'bill_id': stock_bill_id_to_delete}),
    }).done(function () {
        dataTable.DataTable().draw(false);
        toastr.info('Stock Bill was deleted successfully.');
        $('.close').click();
    }).fail(function () {
        toastr.error('Unable to delete stock bill! Please try again.');
    })
}

function loadStockBillsDatatable(date1 = null, date2 = null) {
    $('#stock-bills-datatable thead tr').clone(true).appendTo('#stock-bills-datatable thead').attr("id", "advance-search-bar").attr("class", "d-none my-2").attr("style", "background: #f8f9fa");
    $('#stock-bills-datatable thead tr:eq(1) th').each(function (i) {
        $(this).html(`<input type="text" class="form-control form-control-sm ml-1"/>`);
        if (i === 10) {
            $(this).html('<div class="mb-1 ml-4" id="advance-search-clear-button" type="button" onclick="resetAdvanceSearch()"><i class="fas fa-times" style="font-size: larger" aria-hidden="true"></i></div>');
        } else if (i === 2) {
            $(this).html(`<input type="date" class="form-control form-control-sm ml-1"/>`);
        } else if (i === 0) {
            $(this).html('');
        }
        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                if (this.value !== "") {
                    table.column(i).search("^" + $(this).val(), true, false, true).draw();
                } else {
                    table.column(i).search(this.value).draw();
                }
            }
        });
    });
    const table = loadStockBillsData(date1, date2);

    $('#stock-bills-datatable tbody').on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = table.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            $('td.details-control i', tr).attr('class', 'fas fa-plus').animate({deg: 0}, {
                duration: 400,
                step: function (now) {
                    $(this).css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
            $('div.slider', row.child()).fadeOut(200).slideUp(function () {
                row.child.hide();
            });
        } else {
            // Open this row
            row.child(format(), 'pb-4').show();
            $('td.details-control i', tr).attr('class', 'fas fa-minus').animate({deg: 180}, {
                duration: 400,
                step: function (now) {
                    $(this).css({
                        transform: 'rotate(' + now + 'deg)'
                    });
                }
            });
            loadStockBillDetails(row.data().id, $('div.slider', row.child()));
        }
    });
}

function updateOrdersDatatableRows(date1, date2) {
    let url = `/api/stock-bills-datatable/?format=datatables&date1=${date1}&date2=${date2}`;
    let datatable = dataTable.DataTable();
    datatable.clear().draw();
    datatable.ajax.url(url).load();
}

$('#stock-bill-delete-yes').on('click', function (e) {
    deleteStockBill();
});

$(function () {
    $(document).pos();

    $(document).on('scan.pos.barcode', function (event) {
        console.log(event.code)
        $('#toggle-advance-search-button').prop('checked', true).change();
        $('#advance-search-bar > th:nth-child(2) > input').val(event.code);
        dataTable.DataTable().column(1).search("^" + event.code + "$", true, false, true).draw();
    });
});
