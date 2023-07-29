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
                      <th scope="col" class="font-weight-bolder">Cost (${store_currency})</th>
                      <th scope="col" class="font-weight-bolder">MRP (${store_currency})</th>
                      <th scope="col" class="font-weight-bolder">Final Price (${store_currency})</th>
                      <th scope="col" class="font-weight-bolder">Profit (${store_currency})</th>
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
                          <td>${value.name}</td>
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
        'ajax': url,
        "fnInitComplete": function () {
            const myCustomScrollbar = document.querySelector('#orders-datatable_wrapper .dataTables_scrollBody');
            new PerfectScrollbar(myCustomScrollbar);
        },
        "language": {
            "zeroRecords": `<div class="alert alert-warning text-center" role="alert">
                            No orders found! 
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
                'data': 'date_order',
                render: function (data) {
                    return dateFormat(data, "d mmm yyyy (h:MM TT)");
                }
            },
                        {
                'data': 'customer.firstname',
                render: function (data, type, row) {
                    if(data){
                        return data+' '+row.customer.lastname;
                    }
                    else {
                        return '-'
                    }
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
                    let invoice_or_receipt = ''
                    if (row.customer && row.customer.email){
                        if (row.payment_mode === 'Unpaid'){
                          invoice_or_receipt = `<a class="dropdown-item" onclick="send_email_incoice_or_receipt(${data})"><i class="fa-solid fa-share"></i> Email Invoive</a>`
                        }
                        else {
                            invoice_or_receipt = `<a class="dropdown-item" onclick="send_email_incoice_or_receipt(${data})"><i class="fa-solid fa-share"></i> Email Receipt</a>`
                    }}
                    return `
                               <span class="dropdown"><span type="button" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                                <i class="fa-solid fa-file-invoice-dollar"></i>
                              </span>
                              <div class="dropdown-menu">
                                <a class="dropdown-item" href="/pos/receipt/${data}?mode=print" target="_blank"><i class="fa fa-print" aria-hidden="true"></i> Print</a>
                                <a class="dropdown-item" href="/pos/receipt/${data}" target="_blank"><i class="fa-solid fa-up-right-from-square"></i> View</a>`+
                                invoice_or_receipt
                              +`</div> 
                              </span> 
                              <a id="editModalTriggerA" class="px-2" onclick="editOrderModal('${row.payment_mode}','${row.date_order}', ${row.id})"><i class="fa-solid fa-pen"></i></a>
                            <a class=""><i class="fa fa-trash" aria-hidden="true" data-toggle="modal" data-target="#deleteOrderPrompt" 
                                onclick="deleteOrderConfirmation('${data}')"></i></a>`;
                }
            },
            {'data': 'customer.lastname', "visible": false },
            {'data': 'customer.email', "visible": false},
            {'data': 'customer.phone', "visible": false},
        ],
        "rowCallback": function( row, data, index ) {
          if (data.payment_mode === "Unpaid") {
            $('td', row).css('background-color', '#FEE6E6');
          }
        }
    });
}

function deleteOrderConfirmation(order_id) {
    order_id_to_delete = order_id;
    $('#static-order-id-delete').empty().html(order_id_to_delete);
}

function deleteOrder() {
    let url = `/api/orders/?order_id=${order_id_to_delete}`;

    $.ajax({
        url: url,
        type: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,  // Make sure you have the csrftoken available in your context or obtain it from the cookie
        },
        success: function (data) {
            toastr.info('Order was deleted successfully.');
            // Optionally, you can reload the page or update the order list after successful deletion
            // For example, if you are using DataTables to display orders:
            dataTable.DataTable().draw(false);
            $('.close').click();
        },
        error: function () {
            toastr.error('Unable to delete order! Please try again.');
        }
    });
}

// function deleteOrder() {
//
//     let url = "/api/orders/?order_id=" + order_id_to_delete ;
//
//     $.ajax(url, {
//         method: 'DELETE',
//         headers: {
//             'Content-Type': 'application/json',
//             'X-CSRFToken': csrftoken,
//         },
//         data: {'order_id': order_id_to_delete}
//     }).done(function () {
//         dataTable.DataTable().draw(false);
//         toastr.info('Order was deleted successfully.');
//         $('.close').click();
//     }).fail(function () {
//         toastr.error('Unable to delete order! Please try again.');
//     })
// }

function loadOrdersDatatable(date1 = null, date2 = null) {
    $('#orders-datatable thead tr').clone(true).appendTo('#orders-datatable thead').attr("id", "advance-search-bar").attr("class", "d-none my-2").attr("style", "background: #f8f9fa");
    $('#orders-datatable thead tr:eq(1) th').each(function (i) {
        $(this).html(`<input type="text" class="form-control form-control-sm ml-1"/>`);
        if (i === 10) {
            $(this).html('<div class="mb-1 ml-4" id="advance-search-clear-button" type="button" onclick="resetAdvanceSearch()">Clear <i class="fa fa-close" style="font-size: larger" aria-hidden="true"></i></div>');
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
}

function updateOrdersDatatableRows(date1, date2) {
    let url = `/api/orders-datatable/?format=datatables&date1=${date1}&date2=${date2}`;
    let datatable = dataTable.DataTable();
    datatable.clear().draw();
    datatable.ajax.url(url).load();
}

$('#order-delete-yes').on('click', function () {
    deleteOrder();
});

function send_email_incoice_or_receipt(id){
    Pace.restart();
    fetch(`/api/send_receipt_email/${id}/`, {
        method: 'POST',
        headers: {
            'X-CSRFToken': csrftoken, // Use the global csrf token variable
        },
    })
    .then(response => response.json())
    .then(data => {
        toastr.success(data.message)
        // console.log(data.message); // Receipt email sent successfully.
        // alert('Receipt email sent successfully.');
    })
    .catch(error => {
        // console.error('Error sending receipt email:', error);
        toastr.error('An error occurred while sending the receipt email.');
    });
}

function editOrderModal(CurrentPaymentMode, CurrentDate, order_id){
    var date_time = new Date(CurrentDate)
    date_time.setMinutes(date_time.getMinutes() - date_time.getTimezoneOffset());
    $('#editOrderModal').modal('show');
    document.getElementById('paymentMode').value=CurrentPaymentMode;
    document.getElementById('orderDate').value = date_time.toISOString().slice(0,16);
    document.getElementById('submit-order-edit-btnn').innerHTML = `<button class="btn btn-primary" onclick=updatePaymentMode(${order_id})>Save</button>`
}


function updatePaymentMode(orderId) {
  // Prepare the data to be sent in the API request
  const data = {
      order_id: orderId,
      payment_mode: document.getElementById('paymentMode').value,
      date_order: document.getElementById('orderDate').value
  };

  // Make the API call using the fetch() method with a PUT request
  fetch(`/api/orders/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
         'X-CSRFToken': csrftoken,
      // Add any additional headers if required, such as authentication headers
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    // Handle the API response here if needed
      $('#editOrderModal').modal('hide');
    toastr.success('Payment mode updated successfully:', data)
   dataTable.DataTable().draw(false);

  })
  .catch(error => {
    // Handle any errors that occur during the API call
    // console.error('Error updating payment mode:', error);
    toastr.error('Error updating payment mode:', error)
  });
}


$(function () {
    $(document).pos();
    $(document).on('scan.pos.barcode', function (event) {
        console.log(event.code)
        $('#toggle-advance-search-button').prop('checked', true).change();
        $('#advance-search-bar > th:nth-child(2) > input').val(event.code);
        dataTable.DataTable().column(1).search("^" + event.code + "$", true, false, true).draw();
    });
});

