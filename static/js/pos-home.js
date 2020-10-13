$(document).ready(function () {
    $("#AllProductList").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#AllProductListLi li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    loadTable();
    $('.stepper').mdbStepper();

});


function someFunction21() {
    setTimeout(function () {
        $('#horizontal-stepper').nextStep();
    }, 2000);
}

// SCANNER INPUT
$(function(){
	$(document).pos();
	$(document).on('scan.pos.barcode', function(event){
	    console.log(event.code)
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
function loadTable() {

    var cart_data = "/api/cart";

    $.ajax({
        method: "GET",
        url: cart_data,
        success: function (data) {
            updateCartDetails('Total ' + data.cart_items_quantity + ' items, ₹' +
                '<span id="cart-total-amount">' +data.cart_total+ '</span>')
            var trHTML = '';
            $.each(data.items, function (e, item) {
                trHTML += `<tr><td><div class="font-weight-bold">${item.product.name}        </div>    </td>    <td>${item.product.weight}    </td>    <td>₹${item.product.discount_price}</td>    <td class="text-center text-md-center">        <span class="qty">${item.quantity} </span><div class="btn-group radio-group ml-2" data-toggle="buttons">                                <button type="button"                                        data-product="1001"                                        data-action="remove"                                        class="btn btn-primary btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'remove')"><i                                        class="fas fa-minus"></i>                                </button>                                <button type="button"                                        data-product="1001"ß                                        data-action="add"                                        class="btn btn-primary btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'add')"><i                                        class="fas fa-plus"></i>                                </button>                            </div>    </td>    <td class="font-weight-bold">        <strong>₹${item.amount}</strong>    </td>    <td>        <button type="button"                                        data-product="1001"                                        data-action="add"                                        class="btn btn-danger btn-sm mr-1 btn-rounded" onclick="updateUserOrder(${item.product.product_code}, 'delete')"><i class="fas fa-trash"></i></button></button></td></tr>`;

            });
            $('#datatable-ajax').empty().append(trHTML);
        },
        error: function (error_data) {
            console.log("error");
            console.log(error_data)
        }

    }).done(function () {
        //on return, add here
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
        body: JSON.stringify({'product_code': product_code, 'action': action})
    })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            // console.log(data)
            // location.reload()
            loadTable();
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

