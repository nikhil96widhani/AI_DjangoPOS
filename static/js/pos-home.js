$(document).ready(function () {
    $("#AllProductList").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        product_search(value)
        // $("#AllProductListLi li").filter(function () {
        //     $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        // });
    });
    loadTable();
    $('.stepper').mdbStepper();

});

function product_search(value) {
    let url = '/api/search-products';

    $.getJSON(url, {'search_term': value}, function (response) {
        // $("#AllProductListLi").empty();
        var trHTML = '';
        if (response.products === undefined || response.products.length === 0) {
            trHTML += `<li><div class="alert alert-secondary" role="alert">  No Products Found</div></li>`
        }
        else{
            $.each(response.products, function (e, item) {
                trHTML += '<li class="list-group-item">\n' +
                    '                                                    <div class="row pt-2 ">' +
                    '                                                        <div class="col">' +
                    '                                                            <div>' + item.name +
                    '                                                            </div>' +
                    '                                                            <div class="row">' +
                    '                                                                <div class="col">' +
                    '                                                                    <span class="align-middle text-muted small">Code: ' + item.product_code +'</span>' +
                    '                                                                </div>' +
                    '                                                                <div class="col-auto">' +
                    '                                                                <span class="align-middle text-muted small float-right"> ₹' + item.discount_price +
                    '                                                                </span>' +
                    '                                                                </div>' +
                    '                                                            </div>' +
                    '                                                        </div>' +
                    '                                                        <div class="col-auto">' +
                    '                                                            <button type="button"' +
                    '                                                                    onclick="updateUserOrder(\''+ item.product_code + '\', \'add\')"' +
                    '                                                                    class="btn btn-primary btn-sm mr-1"><i' +
                    '                                                                    class="fas fa-shopping-cart"></i>' +
                    '                                                            </button>' +
                    '                                                        </div>' +
                    '                                                    </div>' +
                    '                                                </li>'
            })
        }
        $("#AllProductListLi").empty().append(trHTML);
    });
}


function nextPos() {
    setTimeout(function () {
        $('#horizontal-stepper').nextStep();
    }, 200);
    // window.location.reload();
}

function completePos() {
    setTimeout(function () {
        window.location.reload();
    }, 1000);

}


// SCANNER INPUT
$(function(){
	$(document).pos();
	$(document).on('scan.pos.barcode', function(event){
        updateUserOrder(event.code, 'add')

		//access `event.code` - barcode data
	});
	$(document).on('swipe.pos.card', function(event){
		//access following:
		// `event.card_number` - card number only
		// `event.card_holder_first_name` - card holder first name only
		// `event.card_holder_last_name` - card holder last name only
		// `event.card_exp_date_month` - card expiration month - 2 digits
		// `event.card_exp_date_year_2` - card expiration year - 2 digits
		// `event.card_exp_date_year_4` - card expiration year - 4 digits
		// `event.swipe_data` - original swipe data from raw processing or sending to a 3rd party service
	});
});
var options = {
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

$(document).pos(options);
// END SCANNER INPUT


// Generate DataTable
function loadTable(product_code, response) {

    var cart_data = "/api/cart";

    $.ajax({
        method: "GET",
        url: cart_data,
        success: function (data) {
            updateCartDetails('Total ' + data.cart_items_quantity + ' items, ₹' +
                '<span id="cart-total-amount">' +data.cart_total+ '</span>')
            var trHTML = '';
            $.each(data.items.reverse(), function (e, item) {
                    if (item.product.product_code === product_code) {
                        trHTML += `<tr class="clicked"><td><div class="text-left font-weight-bold">${item.product.name}        </div>    </td>    <td>${item.product.weight}    </td>    <td>₹${item.product.discount_price}</td>    <td class="text-center text-md-center">        <span class="qty">${item.quantity} </span><div class="btn-group radio-group ml-2" data-toggle="buttons">                                <button type="button"                                        data-product="1001"                                        data-action="remove"                                        class="btn btn-primary btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'remove')"><i class="fas fa-minus"></i>                                </button>                                <button type="button"                                        data-product="1001"                                    data-action="add"                                        class="btn btn-primary btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'add')"><i                                        class="fas fa-plus"></i>                                </button>                            </div>    </td>    <td class="font-weight-bold">        <strong>₹${item.amount}</strong>    </td>    <td>        <button type="button"                                        data-product="1001"                                        data-action="add"                                        class="btn btn-danger btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'delete')"><i class="fas fa-trash"></i></button></button></td></tr>`;

                    } else {
                        trHTML += `<tr><td><div class="text-left font-weight-bold">${item.product.name}        </div>    </td>    <td>${item.product.weight}    </td>    <td>₹${item.product.discount_price}</td>    <td class="text-center text-md-center">        <span class="qty">${item.quantity} </span><div class="btn-group radio-group ml-2" data-toggle="buttons">                                <button type="button"                                        data-product="1001"                                        data-action="remove"                                        class="btn btn-primary btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'remove')"><i                                        class="fas fa-minus"></i>                                </button>                                <button type="button"                                        data-product="1001"                                     data-action="add"                                        class="btn btn-primary btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'add')"><i                                        class="fas fa-plus"></i>                                </button>                            </div>    </td>    <td class="font-weight-bold">        <strong>₹${item.amount}</strong>    </td>    <td>        <button type="button"                                        data-product="1001"                                        data-action="add"                                        class="btn btn-danger btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'delete')"><i class="fas fa-trash"></i></button></button></td></tr>`;

                    }
                });
            $('#datatable-ajax').empty().append(trHTML);
        },
        error: function (error_data) {
            console.log("error");
            console.log(error_data)
        }

    }).done(function () {
        //on return, add here
        var len_cart = document.getElementById('datatable-ajax').getElementsByTagName('tr').length
        console.log(response, len_cart)
        var check_order_empty_html = `<div class="alert alert-primary text-center" role="alert">No products in the cart. Start by adding some products!</div>`;
        if (response != null){
            if (response.response_type === "completed"){
                check_order_empty_html = `<div class="alert alert-primary text-center" role="alert">${response.response_text} <i class="fas fa-long-arrow-alt-down"></i></div>`;
            }
            else if (response.response_type === "updated" && len_cart >= 1 ) {
                check_order_empty_html = ``;
            }
        }
        else if (response == null && len_cart >= 1 ) {
            check_order_empty_html = ``;
        }
        $('#check-order-empty').empty().append(check_order_empty_html);

    });
}


// Update Cart details called inside Datatable update
function updateCartDetails(data) {
    document.getElementById("cart_details").innerHTML = data;
}


// Update Cart
// var updateBtns = document.getElementsByClassName('update-cart')
//
// for (i = 0; i < updateBtns.length; i++) {
//     updateBtns[i].addEventListener('click', function () {
//
//         var product_code = this.dataset.product
//         var action = this.dataset.action
//
//         if (user === 'AnonymousUser') {
//
//         } else {
//             updateUserOrder(product_code, action)
//         }
//     })
// }

function updateUserOrder(product_code, action) {
    var url = "/api/cart/"

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'product_code': String(product_code), 'action': action})
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            console.log(data)
            // location.reload()
            loadTable(product_code.toString(), data);

        });
}


// Refund Calculator
function CalculateRefund(cash) {
    var cart_total_amount = document.getElementById('cart-total-amount');
    cart_total_amount = parseInt(cart_total_amount.innerText)
    cash = parseInt(cash)
    console.log(cart_total_amount- cash)
    if (cash < cart_total_amount) {
        document.getElementById('RefundAmount').innerHTML = "Less Cash Recieved";
    } else if (cash > cart_total_amount) {
        document.getElementById('RefundAmount').innerHTML = "Refund: ₹" + (cash - cart_total_amount).toString();
    } else {
        document.getElementById('RefundAmount').innerHTML = "No items to calculate or unknown error";
    }

}


function CompleteOrder() {
    var url = "/api/cart/"

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({'product_code': null, 'action': 'complete'})
    })
}
