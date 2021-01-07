const dataTable = $("#cart-datatable");
let updated_product_code = null;
let updated_product_id = null;
let total_cart_value = 0;

function loadCartData() {
    let url = '/api/cart-datatable/?format=datatables';
    return dataTable.DataTable({
        ajax: {
            'url': url,
            'dataSrc': 'data.order_items',
        },
        "language": {
            "emptyTable": '<div class="alert alert-primary text-center" role="alert">No products in the cart. Start by adding some products!</div>'
        },
        "initComplete": function () {
            const myCustomScrollbar = document.querySelector('#cart-datatable_wrapper .dataTables_scrollBody');
            new PerfectScrollbar(myCustomScrollbar);
        },
        "scrollY": "48vh",
        "paging": false,
        'dom': "t",
        'fixedHeader': {
            header: true,
            footer: true
        },
        "rowCallback": function (row, data, dataIndex) {
            console.log(data.id, updated_product_id)
            if (data.product_code === updated_product_code || data.id === updated_product_id) {
                $(row).addClass('clicked');
                updated_product_code = null;
                updated_product_id = null;
            }
        },
        'columns': [
            {'data': 'product_name', 'class': 'text-left font-weight-bold', 'width': '30%'},
            {'data': 'weight', render: handleBlankData},
            {'data': 'discount_price'},
            {
                'data': 'quantity', render: function (data, type, row) {
                    return `${data}<div class="btn-group ml-3" data-toggle="buttons">
                                <button class="btn btn-sm btn-primary btn-rounded" onclick="updateUserOrderById('${row.id}', 'remove_quantity')"><i class="fas fa-minus"></i></button>
                                <button class="btn btn-sm btn-primary btn-rounded" onclick="updateUserOrderById('${row.id}', 'add_quantity')"><i class="fas fa-plus"></i></button>
                            </div>`
                }
            },
            {'data': 'amount'},
            {
                'data': 'id', render: function (data) {
                    // console.log(data);
                    return `<button class="btn btn-danger btn-sm btn-rounded mr-4" title="Delete Product" onclick="updateUserOrderById('${data}', 'delete_byId')"><i class="fas fa-trash"></i></button>`
                },
                "orderable": false,
            },
        ],
        'drawCallback': function () {
            let api = this.api();
            let json = api.ajax.json();

            let discount = 'NA'
            let remove_discount = ''
            if (json.data.order.discount != null) {
                discount = json.data.order.discount
                remove_discount = `<button class="btn btn-sm btn-danger btn-rounded ml-3 py-0 px-2 my-0" 
                                    onclick="updateUserOrder('${json.data.order.id}', 'remove_order_discount')">
                                    <i class="fas fa-times"></i></button>`
                if (discount.is_percentage === true) discount = discount.value + '%'
                else discount = '₹' + discount.value
            }

            // let html = `<tr><th class="table-info font-weight-500 h6">Total Quantity -
            //                 <span class="font-weight-bold">${json.data.order.get_cart_items_quantity}</span></th>
            //                 <th class="table-warning font-weight-500 h6">Total Amount -
            //                 <span class="font-weight-bold">₹${json.data.order.get_cart_revenue}</span></th>
            //                 <th class="table-success font-weight-500 h6">Cart Discount -
            //                 <span class="font-weight-bold">${discount}</span>${remove_discount}</th>
            //             </tr>`
            let html = `<div class="col-sm-4 table-info font-weight-500 text-center py-3 h6">Total Quantity -  <span class="font-weight-bold">${json.data.order.get_cart_items_quantity}</span></div>
                        <div class="col-sm-4 table-warning font-weight-500 text-center py-3 h6">Total Amount -  <span class="font-weight-bold">₹${json.data.order.get_cart_revenue}</span></div>
                        <div class="col-sm-4 table-success font-weight-500 text-center py-3 h6">Cart Discount -  <span class="font-weight-bold">${discount}</span>${remove_discount}</div>`
            total_cart_value = json.data.order.get_cart_revenue;
            // $(dataTable.DataTable().table().footer()).html(html);
            $('#total-values-div').html(html);

            let cash_received = $('#CashReceivedValue').val()
            if (cash_received !== ""){
                calculateRefund(cash_received)
            }
        },
    });
}

function updateCartDetails(quantity, total) {
    document.getElementById("cart_details").innerHTML = 'Total ' + quantity + ' items, ₹' +
        '<span id="cart-total-amount">' + total + '</span>';
}

function updateUserOrder(product_code, action) {
    let url = "/api/cart/"
    let method = 'POST'
    if (action === 'clear' || action === 'remove_order_discount') {
        method = 'PUT'
    }

    $.ajax(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify({'product_code': String(product_code), 'action': action}),
        success: function (data) {
            console.log(data)
            updated_product_code = product_code;
            dataTable.DataTable().draw('page');
        },
        error: function () {
            toastr.error('Could not update cart! Please Try Again.');
        },
        complete: function () {

        }
    })
}

function updateUserOrderById(orderitem_id, action) {
    let url = "/api/cart/"
    let method = 'POST'

    $.ajax(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify({'orderitem_id': orderitem_id, 'action': action}),
        success: function (data) {
            console.log(data)
            updated_product_id = Number(orderitem_id);
            dataTable.DataTable().draw('page');
        },
        error: function () {
            toastr.error('Could not update cart! Please Try Again.');
        },
        complete: function () {

        }
    })
}

function product_search(value) {
    let url = '/api/search-products';

    $.getJSON(url, {'search_term': value}, function (response) {
        let trHTML = '';
        if (response.products === undefined || response.products.length === 0) {
            trHTML += `<li><div class="alert alert-secondary" role="alert">  No Products Found</div></li>`
        } else {
            $.each(response.products, function (e, item) {
                trHTML += `<li class="list-group-item">
                            <div class="row pt-2 ">
                                <div class="col"><div>${item.name}</div>
                                    <div class="row">
                                       <div class="col"><span class="align-middle text-muted small">Code: ${item.product_code}</span></div>
                                       <div class="col-auto"><span class="align-middle text-muted small float-right"> ₹${item.discount_price}</span></div>
                                    </div>
                                </div>
                                <div class="col-auto">
                                    <button type="button" onclick="updateUserOrder('${item.product_code}', 'add')" class="btn btn-primary btn-sm mr-1">
                                        <i class="fas fa-shopping-cart"> +</i>
                                    </button>
                                </div>
                            </div></li>`
            })
        }
        $("#AllProductListLi").empty().append(trHTML);
    });
}

function nextPos() {
    setTimeout(function () {
        $('#horizontal-stepper').nextStep();
    }, 200);
}

function completePos() {
    setTimeout(function () {
        // $('#horizontal-stepper').nextStep();
        window.location.reload();
        $('#horizontal-stepper').nextStep();
    }, 1000);

}


// SCANNER INPUT
$(function () {
    $(document).pos();
    $(document).on('scan.pos.barcode', function (event) {
        updateUserOrder(event.code, 'add')

        //access `event.code` - barcode data
    });
    // $(document).on('swipe.pos.card', function(event){
    // 	//access following:
    // 	// `event.card_number` - card number only
    // 	// `event.card_holder_first_name` - card holder first name only
    // 	// `event.card_holder_last_name` - card holder last name only
    // 	// `event.card_exp_date_month` - card expiration month - 2 digits
    // 	// `event.card_exp_date_year_2` - card expiration year - 2 digits
    // 	// `event.card_exp_date_year_4` - card expiration year - 4 digits
    // 	// `event.swipe_data` - original swipe data from raw processing or sending to a 3rd party service
    // });
});
// END SCANNER INPUT

// Refund Calculator
function calculateRefund(cash) {
    let cart_total_amount = total_cart_value
    // cart_total_amount = parseInt(cart_total_amount.innerText)
    // cash = parseInt(cash)
    // console.log(cart_total_amount - cash)
    if (cash < cart_total_amount) {
        document.getElementById('RefundAmount').innerHTML = "Less Cash Received";
    } else if (cash >= cart_total_amount) {
        document.getElementById('RefundAmount').innerHTML = "Refund: ₹" + (cash - cart_total_amount).toString();
    } else {
        document.getElementById('RefundAmount').innerHTML = "No items to calculate or unknown error";
    }
}

function CompleteOrder() {
    let payment_mode = document.getElementById("payment-mode")
    let url = "/api/cart/"

    $.ajax(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify({'product_code': null, 'action': 'complete', 'payment-mode': payment_mode.value}),
        success: function (data) {
            // console.log(data)
        }
    })
}

$('#CashReceivedValue').on('input', function () {
    calculateRefund($(this).val())
});

function quickAddProduct() {
    let url = "/api/cart/"
    let name = document.getElementById('qa_name').value
    let quantity = document.getElementById('qa_quantity').value
    let discount_price = document.getElementById('qa_discount_price').value

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'name': name,
            'discount_price': discount_price,
            'quantity': quantity,
            'action': 'quick_add'
        })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            // updated_product_id = data.id;
            dataTable.DataTable().draw('page');
            toastr.success(data.response_text)
        }).catch(error => {
        //Here is still promise
        // console.log(error);
        toastr.error('An error occurred please check the values entered')
    })
}


function discountOrder() {
    let url = "/api/cart/"
    let value = document.getElementById('discount_value').value
    let is_percentage = document.getElementById("discount_value_checkbox").checked

    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({
            'action': 'apply_discount',
            'value': value,
            'is_percentage': is_percentage,
        })
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data)
            dataTable.DataTable().draw('page');
            toastr.success(data.response_text)
        }).catch(error => {
        //Here is still promise
        // console.log(error);
        toastr.error('An error occurred please check the value entered')
    })
}

function open_receipt_and_reload(url) {
    //Open in new tab
    window.open(url, '_blank');
    //focus to thet window
    window.focus();
    //reload current page
    CompleteOrder()
    location.reload();
}


$(document).ready(function () {
    $("#AllProductList").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        product_search(value)
    });
    product_search(null)
    loadCartData();
    $('.stepper').mdbStepper();
    // const myCustomScrollbar = document.querySelector('#AllProductListLi');
    // const ps = new PerfectScrollbar(myCustomScrollbar);
});
