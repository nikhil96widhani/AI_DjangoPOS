const dataTable = $("#cart-datatable");
let updated_product_code = null;

function loadCartData() {
    let url = '/api/cart-datatable/?format=datatables';
    return dataTable.DataTable({
        'ajax': url,
        "fnInitComplete": function () {
            const myCustomScrollbar = document.querySelector('#cart-datatable_wrapper .dataTables_scrollBody');
            new PerfectScrollbar(myCustomScrollbar);
        },
        "language": {
            "emptyTable": '<div class="alert alert-primary text-center" role="alert">No products in the cart. Start by adding some products!</div>'
        },
        "scrollY": "55vh",
        // "scrollCollapse": true,
        "paging": false,
        'dom': "t",
        'fixedHeader': true,
        "rowCallback": function (row, data, dataIndex) {
            if (data.product_code === updated_product_code) {
                $(row).addClass('clicked');
            }
        },
        'columns': [
            {'data': 'product_name', 'class': 'text-left font-weight-bold'},
            {'data': 'product.weight', render: handleBlankData},
            {'data': 'discount_price'},
            {
                'data': 'quantity', render: function (data, type, row) {
                    return `${data}<div class="btn-group ml-3" data-toggle="buttons">
                                <button class="btn btn-sm btn-primary btn-rounded" onclick="updateUserOrder('${row.product_code}', 'remove')"><i class="fas fa-minus"></i></button>
                                <button class="btn btn-sm btn-primary btn-rounded" onclick="updateUserOrder('${row.product_code}', 'add')"><i class="fas fa-plus"></i></button>
                            </div>`
                }
            },
            {'data': 'amount'},
            {
                'data': 'product_code', render: function (data) {
                    return `<button class="btn btn-danger btn-sm btn-rounded mr-4" title="Delete Product" onclick="updateUserOrder('${data}', 'delete')"><i class="fas fa-trash"></i></button>`
                },
                "orderable": false,
            },
        ],
        'drawCallback': function (row, data, index) {
            let quantity = dataTable.DataTable().column(3).data().reduce((a, b) => a + b, 0)
            let amount = dataTable.DataTable().column(4).data().reduce((a, b) => a + b, 0)
            updateCartDetails(quantity, amount)
        }
    });
}

function updateCartDetails(quantity, total) {
    document.getElementById("cart_details").innerHTML = 'Total ' + quantity + ' items, ₹' +
        '<span id="cart-total-amount">' + total + '</span>';
}

function updateUserOrder(product_code, action) {
    console.log('Function called')
    let url = "/api/cart/"
    let method = 'POST'
    if (action === 'clear') {
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
let options = {
    scan: true, //enable scan event
    submit_on_scan: false, //allow the keycode 13 event to continue on scan
    swipe: true, //enable swipe event
    submit_on_swipe: false, //allow the keycode 13 event to continue on swipe
    events: {
        scan: {
            barcode: 'scan.pos.barcode' //event name for successfully scanned barcode
        },
        swipe: {
            card: 'swipe.pos.card' //event name for successfully scanned card
        }
    },
    regexp: {
        scan: {
            barcode: '\\d+' //regexp for barcode validation
        },
        swipe: {
            card: '\\%B(\\d+)\\^(\\w+)\\/(\\w+)\\^\\d+\\?;\\d+=(\\d\\d)(\\d\\d)\\d+\\?' //regexp for credit card validation
        }
    },
    prefix: {
        scan: {
            barcode: '*' //prefix for barcode - will be added to regexp
        },
        swipe: {
            card: '' //prefix for credit card - will be added to regexp
        }
    }
};

// $(document).pos(options);
// END SCANNER INPUT

// Refund Calculator
function calculateRefund(cash) {
    let cart_total_amount = document.getElementById('cart-total-amount');
    cart_total_amount = parseInt(cart_total_amount.innerText)
    cash = parseInt(cash)
    console.log(cart_total_amount - cash)
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
            console.log(data)
        }
    })
}

$('#CashReceivedValue').on('input', function () {
    calculateRefund($(this).val())
});

$(document).ready(function () {
    $("#AllProductList").on("keyup", function () {
        let value = $(this).val().toLowerCase();
        product_search(value)
    });
    loadCartData();
    $('.stepper').mdbStepper();
    // const myCustomScrollbar = document.querySelector('#AllProductListLi');
    // const ps = new PerfectScrollbar(myCustomScrollbar);
});
