let order_id_to_delete;
const dataTable = $("#orders-datatable");

function loadOrderDetails(order_id, selector) {
    selector.html('Loading...');
    let url = '/api/order-items/';

    let html = `<table class="table table-sm table-hover table-active">
                  <thead>
                    <tr>
                      <th scope="col" class="font-weight-bolder">#</th>
                      <th scope="col" class="font-weight-bolder">Product Code</th>
                      <th scope="col" class="font-weight-bolder">Product Name</th>
                      <th scope="col" class="font-weight-bolder">Quantity</th>
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
            $.each(data["order_items"], function (key, value) {
                html += `<tr>
                          <td>${count}</td>
                          <td>${value.product_code}</td>
                          <td>${value.product_name}</td>
                          <td>${value.quantity}</td>
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
            html = 'Could not fetch Order Details! Please Try Again.'
        },
        complete: function () {
            selector.html(html).slideDown(200);
        }
    });
}

function format() {
    return '<div class="slider text-center" style="display: none">Loading...</div>';
}

function loadOrdersData(date1, date2) {
    let url = '/api/orders-datatable/?format=datatables';
    if (date1 !== null && date2 !== null) {
        url = `/api/orders-datatable/?format=datatables&date1=${date1}&date2=${date2}`;
    }
    return dataTable.DataTable({
        'serverSide': true,
        'processing': true,
        "language": {
            processing: '<i class="fa fa-spinner fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span>'
        },
        'ajax': url,
        "fnInitComplete": function () {
            const myCustomScrollbar = document.querySelector('#orders-datatable_wrapper .dataTables_scrollBody');
            const ps = new PerfectScrollbar(myCustomScrollbar);
        },
        // select: true,
        orderCellsTop: true,
        "scrollX": true,
        // keys: true,
        lengthMenu: [[10, 50, 100, 500, 1000, -1], [10, 50, 100, 500, 1000, "All"]],
        order: [],
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-2'><'col-sm-12 col-md-5'p>>" +
            "<'row'<'col text-right pt-2'B>>",
        buttons: [
            'copy', 'excel', 'pdf', 'print', 'colvis'
        ],
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
                'data': 'date_order',
                render: function (data) {
                    return dateFormat(data, "d mmm yyyy (HH:MM)");
                }
            },
            {'data': 'cart_quantity'},
            {'data': 'payment_mode'},
            {'data': 'cart_cost'},
            {'data': 'cart_mrp'},
            {'data': 'cart_revenue'},
            {'data': 'cart_profit'},
            {
                'data': 'id', sortable: false, render: function (data, type, row) {
                    return `<a class="pr-3"><i class="fa fa-trash" aria-hidden="true" data-toggle="modal" data-target="#deleteOrderPrompt" onclick="deleteOrderConfirmation('${data}')"></i></a>
                            <a class="" href="/pos/receipt/${data}" target="_blank"><i class="fa fa-print" aria-hidden="true"></i></a>`;
                }
            },
        ],
    });
}

function deleteOrderConfirmation(order_id) {
    order_id_to_delete = order_id;
    $('#static-order-id-delete').empty().html(order_id_to_delete);
}

function deleteOrder() {
    let url = "/api/orders/" + order_id_to_delete + "/";

    $.ajax(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    }).done(function () {
        dataTable.DataTable().ajax.reload();
        dataTable.DataTable().draw(false);
        toastr.info('Order was deleted successfully.');
        $('.close').click();
    }).fail(function () {
        toastr.error('Unable to delete order! Please try again.');
    })
}

function loadOrdersDatatable(date1 = null, date2 = null) {
    $('#orders-datatable thead tr').clone(true).appendTo('#orders-datatable thead').attr("id", "advance-search-bar").attr("class", "d-none my-2");
    $('#orders-datatable thead tr:eq(1) th').each(function (i) {
        const title = $(this).text();
        $(this).html(`<input type="text" class="form-control form-control-sm ml-1"/>`);
        if (i === 9) {
            $(this).html('<div class="mb-1 ml-4" id="advance-search-clear-button" type="button"><i class="fa fa-close" style="font-size: larger" aria-hidden="true"></i></div>');
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
    const table = loadOrdersData(date1, date2);

    $('#orders-datatable tbody').on('click', 'td.details-control', function () {
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
            loadOrderDetails(row.data().id, $('div.slider', row.child()));
        }
    });

    $('#advance-search-clear-button').click(function (e) {
        resetAdvanceSearch(table);
    })
}

function resetAdvanceSearch(table) {
    // console.log($('#advance-search-bar th input'))
    for (x of $('#advance-search-bar th input')) {
        $(x).val('');
    }
    table.search('').columns().search('').draw();
}

function updateOrdersDatatableRows(date1, date2) {
    let url = `/api/orders-datatable/?format=datatables&date1=${date1}&date2=${date2}`;
    let datatable = dataTable.DataTable();
    datatable.clear().draw();
    datatable.ajax.url(url).load();
}

$('#toggle-advance-search-button').change(function () {
    if (this.checked) {
        $('#advance-search-bar').removeClass('d-none');
    } else {
        $('#advance-search-bar').addClass('d-none');
    }
});

$('#order-delete-yes').on('click', function (e) {
    deleteOrder();
});

