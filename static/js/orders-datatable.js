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
                      <th scope="col" class="font-weight-bolder">Cost</th>
                      <th scope="col" class="font-weight-bolder">MRP</th>
                      <th scope="col" class="font-weight-bolder">Final Price</th>
                      <th scope="col" class="font-weight-bolder">Profit</th>
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
                          <td>${value.product.product_code}</td>
                          <td>${value.product.name}</td>
                          <td>${value.quantity}</td>
                          <td>${attachRupeeSymbol(value.product.cost)}</td>
                          <td>${attachRupeeSymbol(value.product.mrp)}</td>
                          <td>${attachRupeeSymbol(value.product.discount_price)}</td>
                          <td>${attachRupeeSymbol(value.product.cost - value.product.discount_price)}</td>
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

function loadOrdersData() {
    return dataTable.DataTable({
        'serverSide': false,
        'ajax': '/api/orders-datatable/?format=datatables',
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
                "render": function (data, type, row) {
                    return '<span class="badge badge-pill badge-info py-1" type="button"><i class="fas fa-plus"></i></span>'
                }
            },
            {'data': 'id',},
            {
                'data': 'date_order', render: function (data, type, row) {
                    return dateFormat(data, "d mmm yyyy (HH:MM)");
                }
            },
            {'data': 'get_cart_items_quantity'},
            {'data': 'get_cart_cost_total', render: attachRupeeSymbol},
            {'data': 'get_cart_mrp_total', render: attachRupeeSymbol},
            {'data': 'get_cart_total', render: attachRupeeSymbol},
            {'data': 'get_cart_revenue', render: attachRupeeSymbol},
            {
                'data': 'id', sortable: false, render: function (data, type, row) {
                    return `<a class="pr-3"><i class="fa fa-trash-o" aria-hidden="true" data-toggle="modal" data-target="#deleteOrderPrompt" onclick="deleteOrderConfirmation('${data}')"></i></a>
                            <a class="" href="/pos/receipt/${data}"><i class="fa fa-print" aria-hidden="true"></i></a>`;
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

$(document).ready(function () {
    $('#orders-datatable thead tr').clone(true).appendTo('#orders-datatable thead').attr("id", "advance-search-bar").attr("class", "d-none my-2");
    $('#orders-datatable thead tr:eq(1) th').each(function (i) {
        const title = $(this).text();
        $(this).html(`<input type="text" class="form-control form-control-sm"/>`);
        if (i === 8) {
            $(this).html('<span class="form-control form-control-sm text-center border-0"><i class="fa fa-search" aria-hidden="true"></i></span>');
        }
        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                if (i !== 2 && this.value !== "") {
                    table.column(i).search("^" + $(this).val() + "$", true, false, true).draw();
                } else {
                    table.column(i).search(this.value).draw();
                }
            }
        });
    });
    const table = loadOrdersData();

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
});

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

