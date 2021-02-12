const dataTable = $("#cart-datatable");
let updated_product_code = 0;
let updated_product_id = 0;
let total_cart_value = 0;

const getDatatableInput = (order_item_id, name, value) => {
    return `<input class="form-control input-sm px-1 text-center update-order-item" type="number" min="0" 
              name="${name}" value="${value}" data-order-item-id=${order_item_id} style="height: 20px;">`;
}

function loadCartData() {
    let url = '/api/cart-datatable-new/?format=datatables';
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
            if (data.product_code === updated_product_code || data.id === updated_product_id) {
                $(row).addClass('clicked');
                updated_product_code = 0;
                updated_product_id = 0;
            }
        },
        'columns': [
            {'data': 'name', 'class': 'text-left font-weight-bold'},
            {'data': 'weight', 'width': '10%', render: handleBlankData},
            {
                'data': 'mrp', 'width': '10%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 70px">
                            ${getDatatableInput(row.id, 'mrp', data)}
                            </div>`
                }
            },
            {
                'data': 'discount_price', 'width': '12%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 70px">
                            ${getDatatableInput(row.id, 'discount_price', data)}
                            </div>`
                }
            },
            {
                'data': 'quantity', 'width': '10%', render: function (data, type, row) {
                    return `<div class="input-group " style="width: 70px">
                              <div class="input-group-prepend">
                                <button class="btn btn-sm btn-primary btn-rounded m-0 px-2 py-0 z-depth-0 
                                waves-effect minus decrease" onclick="updateCartByQuantityValue(this, ${row.id}, 'remove')"
                                > <i class="fas fa-minus"></i> </button>
                              </div>
                              ${getDatatableInput(row.id, 'quantity', data)}
                              <div class="input-group-append">
                                <button class="btn btn-sm btn-primary btn-rounded m-0 px-2 py-0 z-depth-0 waves-effect 
                                plus increase" onclick="updateCartByQuantityValue(this, ${row.id}, 'add')"
                                ><i class="fas fa-plus"></i></button>
                              </div>
                            </div>`
                }
            },
            {'data': 'amount', 'width': '12%'},
            {
                'data': 'id', 'width': '10%', render: function (data) {
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
            if (cash_received !== "") {
                calculateRefund(cash_received)
            }
        },
    });
}

function updateOrderDetails(data_json, reload_table, reload_page = false) {
    console.log(JSON.stringify(data_json))
    let url = "/api/handle-order/"

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(data_json),
        success: function (data) {
            console.log(data)
            toastr.success(data.response);
            if (reload_table === true) {
                dataTable.DataTable().draw('page');
            }
            if (reload_page === true) {
                window.location.reload();
            }
            // console.log(data)
        },
        error: function () {
            toastr.error('An error occurred please check the value entered');
        },
        // complete: function () {
        // }
    })
}

//CallBacks
dataTable.on('change', '.update-order-item', function () {
    let data_json = {
        'action': 'update-order-item',
        'order_item_id': this.getAttribute('data-order-item-id'),
        [this.name]: this.value
    }
    updateOrderDetails(data_json, true)
    // updated_variation_id = parseInt(this.getAttribute('data-variation-id'));
});


// Initialize with options
onScan.attachTo(document, {
    suffixKeyCodes: [13], // enter-key expected at the end of a scan
    reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
    onScan: function (sCode) { // Alternative to document.addEventListener('scan')
        console.log(sCode)
        let data_json = {
            'action': 'add-order-item',
            'product_code': sCode,
        }
        updateOrderDetails(data_json, true)
    },
});
// END SCANNER INPUT




//Old Functions ##############################################################
function product_search(value) {
    let url = '/api/product-variation-search/';

    $.getJSON(url, {'search_term': value}, function (response) {
        let trHTML = '';
        if (response === undefined || response.length === 0) {
            trHTML += `<li><div class="alert alert-secondary" role="alert">  No Products Found</div></li>`
        } else {
            $.each(response, function (e, item) {
                trHTML += `<li class="list-group-item">
                            <div class="row pt-2 ">
                                <div class="col"><div>${item.product.name}</div>
                                    <div class="row">
                                       <div class="col"><span class="align-middle text-muted small">Code: ${item.product.product_code}</span></div>
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


function completePos() {
    setTimeout(function () {
        // $('#horizontal-stepper').nextStep();
        window.location.reload();
        $('#horizontal-stepper').nextStep();
    }, 500);

}


// SCANNER INPUT
// $(function () {
//     $(document).pos();
//     $(document).on('scan.pos.barcode', function (event) {
//         updateUserOrder(event.code, 'add')
//     });
// });



// Refund Calculator
function calculateRefund(cash) {
    let cart_total_amount = total_cart_value
    // cart_total_amount = parseInt(cart_total_amount.innerText)inventory_orderitem
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
            // console.log(data)
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
    // CompleteOrder()
    // //Open in new tab
    // window.open(url, '_blank');
    // //focus to that window
    // window.focus();
    // //reload current page
    // location.reload();


    let payment_mode = document.getElementById("payment-mode")
    let url2 = "/api/cart/"

    $.ajax(url2, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify({'product_code': null, 'action': 'complete', 'payment-mode': payment_mode.value}),
        complete: function () {
            //Open in new tab
            window.open(url, '_blank');
            //focus to that window
            window.focus();
            //reload current page

            location.reload();
        }
    })

}


$(document).ready(function () {
    $("#AllProductList").on("input", function () {
        let value = $(this).val().toLowerCase();
        product_search(value)
    });
    product_search(null)
    loadCartData();
    $('.stepper').mdbStepper();
    // const myCustomScrollbar = document.querySelector('#AllProductListLi');
    // const ps = new PerfectScrollbar(myCustomScrollbar);
});