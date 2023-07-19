let input_products = document.getElementById("ProductSearchInputPos")
let div_products_list = document.getElementById("AllProductListLi")
const multiple_variation_table = $("#product-variation-select-datatable");
const dataTable = $("#cart-datatable");
let updated_order_item_id = 0;
let total_cart_value = 0;
let variation_id_to_delete, scanned_product_code;


const getDatatableInput = (order_item_id, name, value) => {
    return `<input class="form-control no-border text-center update-order-item" type="number" min="0" 
              name="${name}" value="${value}" data-order-item-id=${order_item_id}>`;
}

// Cart Datatable
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
        // "initComplete": function () {
        //     const myCustomScrollbar = document.querySelector('#cart-datatable_wrapper .dataTables_scrollBody');
        //     // new PerfectScrollbar(myCustomScrollbar);
        // },
        // "scrollY": "60vh",
        "paging": false,
        'dom': "t",
        'fixedHeader': {
            header: true,
            footer: true
        },
        "rowCallback": function (row, data, dataIndex) {
            if (data.id === updated_order_item_id) {
                $(row).addClass('clicked');
            }
            // updated_order_item_id = 0;
        },
        'columns': [
            {'data': 'name', 'class': 'text-left title', render: function (data, type, row) {
                if(row.weight && row.weight_unit){
                    if (data.includes(`${row.weight}${row.weight_unit}`)){
                        let product = data.replace(`${row.weight}${row.weight_unit}`, "");
                        return `${product}, ${row.weight}${row.weight_unit}`
                    }
                    else {
                        return `${data}, ${row.weight}${row.weight_unit}`
                    }
                }
                else{
                    return data
                }
                }},
            {'data': 'mrp', 'class': 'update-order-item text-center', 'width': '11%', render: function (data, type, row) {
                    return `<div class="input-group input-group-sm">
                            ${getDatatableInput(row.id, 'mrp', data)}
                            </div>`
                }
            },
            {'data': 'discount_price', 'class': 'update-order-item text-center', 'width': '11%', render: function (data, type, row) {
                    return `<div class="input-group input-group-sm">
                            ${getDatatableInput(row.id, 'discount_price', data)}
                            </div>`
                }
            },

            {
                'data': 'quantity', 'class': 'text-left', 'width': '11%', render: function (data, type, row) {
                    return `<div class="input-group quantity-stepper">
                                    <button class="btn btn-outline-primary btn-sm button-rounded-left update-quantity" type="button"
                                            data-action="minus">-
                                    </button>
                                    <input class="form-control btn-sm px-1 text-center update-order-item" type="number"
                                           min="0" name="quantity" value=${data} data-order-item-id="${row.id}">
                                    <button class="btn btn-outline-primary btn-sm button-rounded-right update-quantity" type="button"
                                            data-action="plus">
                                        +
                                    </button>
                                </div>`
                }
            },
            {'data': 'amount', 'class': 'text-center', 'width': '10%'},
            {
                'data': 'id', 'class': 'text-center', 'width': '6%', render: function (data) {
                    return `<button class="btn py-0 px-1 update-quantity"
                             title="Delete Product" data-action="delete">
                                <i class="material-icons md-delete text-black-50"></i>
                            </button>`
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
                                    onclick="updateOrderDetails({'order_id': ${json.data.order.id}, 
                                    'action': 'order-discount', 
                                    'sub-action': 'remove_order_discount'
                                    }, true)">
                                    <i class="fas fa-times"></i></button>`
                if (discount.is_percentage === true) discount = discount.value + '%'
                else discount = store_currency + discount.value
            }
            let html = `<article class="">
                            <dl class="dlist">
                                <dt><b>Total Quantity:</b></dt>
                                <dd>${json.data.order.get_cart_items_quantity}</dd>
                            </dl>
                            <dl class="dlist">
                                <dt><b>Cart Discount:</b></dt>
                                <dd>${discount} ${remove_discount}</dd>
                            </dl>
                            <dl class="dlist">
                                <dt><b>Total Amount:</b></dt>
                                <dd class="fw-bold h5">${store_currency}${json.data.order.get_cart_revenue}</dd>
                            </dl>
                        </article>`
            total_cart_value = json.data.order.get_cart_revenue;
            $('#total-values-div').html(html);

            let cash_received = $('#CashReceivedValue').val()
            if (cash_received !== "") {
                // calculateRefund(cash_received)
            }
        },
    });
}
// Cart Datatable

// Helper Functions
function calculateRefund(cash) {
    let cart_total_amount = total_cart_value
    if (cash < cart_total_amount) {
        document.getElementById('RefundAmount').innerHTML = "Less Cash Received";
    } else if (cash >= cart_total_amount) {
        document.getElementById('RefundAmount').innerHTML = "Refund: "+ store_currency + roundToTwoDecimal(cash - cart_total_amount).toString();
    } else {
        document.getElementById('RefundAmount').innerHTML = "No items to calculate or unknown error";
    }
}
// Helper Functions

// Product Search
function product_search(value) {
    let url = '/api/product-variation-search/';

    $.getJSON(url, {'search_term': value}, function (response) {
        let HTML = '';
        if (response === undefined || response.length === 0) {
            HTML += `<div class="alert alert-secondary m-2" role="alert">No Products Found</div>`
        } else {
            var final_data_arr = response.slice(0, 5)
            $.each(final_data_arr, function (e, item) {
                var weight = ''
                if (item.weight !== null && item.weight_unit !== null ){
                    weight = `(${item.weight} ${item.weight_unit})`
                }
                HTML += `<article class="box py-2 px-2 mx-2 ${(e===final_data_arr.length -1 ? '' : 'mb-2')}">
                    <div class="itemside">
<!--                       <div class="aside">-->
<!--                          <img src="https://gdm-catalog-fmapi-prod.imgix.net/ProductLogo/9d877957-e370-4f7c-8a0a-27ce66b04c41.png?auto=format&size=150" width="96" height="96" class="img-sm rounded">-->
<!--                      </div>-->
                        <div class="info w-100 p-0">
                            <button class="btn btn-outline-primary px-1 py-0 float-end add-variation-to-order" 
                            data-variation-id=${item.id} >
                                <i class="material-icons md-shopping_cart fa-sm"> +</i>
                            </button>
                            <div class="title"><b>${item.product.name} ${weight}</b></div>
                            <div class="text-muted">Code: ${item.product.product_code}</div>
                            <div class="text-muted">MRP: ${store_currency}${item.mrp} | OurPrice: ₹${item.discount_price}</span>
                        </div>
                    </div>
                </article>`
            })
        }
        div_products_list.style.display = 'block';
        if (value.length >0){
            div_products_list.innerHTML = `<div class="py-2 mb-2">${HTML}<div>`;
        }
        else {
            div_products_list.innerHTML = '';
        }

    });
}

// Update Order
async function updateOrderDetails(data_json, reload_table = false, reload_page = false, toast_message = false) {
    let url = "/api/handle-order/"

    await $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(data_json),
        success: function (data) {
            if (data.multiple_variation_exists === true) {
                toastr.info('Multiple Variation Exists');
                prepareAndFillProductVariationModal(data)
            } else {
                if (reload_table === true) {
                    dataTable.DataTable().draw('page');
                    if (data.status !== 'cart-cleared'){
                        updated_order_item_id = data.data.id;
                    }
                }
                if (reload_page === true) {
                    window.location.reload();
                }
                if (toast_message === true) {
                    toastr.success(data.response);
                }
            }
        },
        error: function () {
            toastr.error('An error occurred please check the value entered');
        },
        // complete: function () {
        // }
    })
}
// Product Search

// Event Listeners
document.getElementById("clearProductSearchInputPos").addEventListener('click', function () {
    document.getElementById("ProductSearchInputPos").value = ''
});

document.getElementById("ProductSearchInputPos").addEventListener('input', function () {
    let value = $(this).val().toLowerCase();
    product_search(value)
});

$("#AllProductListLi").on('click', '.add-variation-to-order', function () {
    let data_json = {
        'action': 'add-order-item',
        'variation_id': this.getAttribute('data-variation-id'),
    }
    let callUpdateOrderDetails = updateOrderDetails(data_json, true)
    div_products_list.style.display = 'none';
});
// This is to stop search modal from closing when clicking inside the search results
$('#AllProductListLi').on('mousedown', function(event) {
    event.preventDefault();
});
// document.getElementById('product-search-group').addEventListener('focusout', (event) => {
//     // alert(document.activeElement.classList)
//     div_products_list.style.display = 'none';
// });
// document.getElementById('product-search-group').addEventListener('focusin', (event) => {
//     div_products_list.style.display = 'block';
// });
// document.getElementById("ProductSearchInputPos").addEventListener('click', function () {
//     div_products_list.style.display = 'block';
// });

document.getElementById("btn-clear-cart").addEventListener('click', function () {
    let callUpdateOrderDetails = updateOrderDetails({'action': 'clear-cart'}, true)
});
// document.getElementById("quick-add-button").addEventListener('click', function () {
//     document.getElementById("quickAddDiv").style.display = 'block';
// });

dataTable.on('click', '.update-quantity', function () {
    const action = this.getAttribute('data-action');
    const quantity_selector = this.closest('tr').querySelector('input[name="quantity"]')
    let quantity_value = parseInt(quantity_selector.value);

    if (action === 'plus') quantity_value++;
    else if (action === 'minus') quantity_value--;
    else if (action === 'delete') quantity_value = 0;

    let data_json = {
        'action': 'update-order-item',
        'order_item_id': quantity_selector.getAttribute('data-order-item-id'),
        [quantity_selector.name]: quantity_value
    }

    let callUpdateOrderDetails = updateOrderDetails(data_json, true)
});

// // Content Editable api calls
// dataTable.on('keypress', '[contenteditable]', function(e){
//     var key = e.keyCode || e.charCode;
//     if (key >= 48 && key <= 57) {
//         // alert('You pressed ' + (key - 48));
//     }
//     else if (e.which === 13){
//         let data_json = {
//             'action': 'update-order-item',
//             'order_item_id': this.getAttribute('data-order-item-id'),
//             [this.getAttribute('name')]: this.innerHTML
//         }
//         let callUpdateOrderDetails = updateOrderDetails(data_json, true)
//         return false
//     }
//     else {
//         return false
//     }
// });
//
// dataTable.on('blur', '[contenteditable]', function(e) {
//         let data_json = {
//         'action': 'update-order-item',
//         'order_item_id': this.getAttribute('data-order-item-id'),
//         [this.getAttribute('name')]: this.innerHTML
//     }
//     let callUpdateOrderDetails = updateOrderDetails(data_json, true)
// });

dataTable.on('change', '.update-order-item', function () {
    let data_json = {
        'action': 'update-order-item',
        'order_item_id': this.getAttribute('data-order-item-id'),
        [this.name]: this.value
    }
    let callUpdateOrderDetails = updateOrderDetails(data_json, true)
});

// Document Ready Event Listners
window.addEventListener('DOMContentLoaded', (event) => {
    // Load Cart Data
    loadCartData();
    // Load Cart Data
});