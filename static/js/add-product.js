let discount_price_selector = $('#discount_price')
let discount_percent_selector = $('#discount_percent')
let mrp_selector = $('#mrp')

function addProductDetails(form) {
    const formData = getFormData($(form));
    formData["product_code"] = $('#product_code').val();
    formData["category"] = $('#product_categories').val();
    formData["expiry_date"] = $('#expiry_date').val();
    if (formData["expiry_date"] === ""){
        formData["expiry_date"] = null;
    }
    console.log(formData);
    let url = "/api/products/"

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(formData)
    }).done(function () {
        toastr.info('Product was successfully added.');
        $('#add-product-form').trigger('reset');
        $('#product_code').removeAttr('disabled');
    }).fail(function () {
        toastr.error('Product was not saved! Please try again.');
    })
}

function generateProductCode(checkbox) {
    let product_code_text_field = $('#product_code');
    if (checkbox.checked) {
        let url = '/api/product-code-generator/';

        $.getJSON(url, {}, function (response) {
            console.log(response.unique_product_code);
            product_code_text_field.val(response.unique_product_code);
            product_code_text_field.attr('disabled', 'disabled');
        });
    } else {
        product_code_text_field.val('');
        product_code_text_field.removeAttr('disabled');
    }
}

function addCategory() {
    const formData = {'name': $('#category_name').val()};
    let url = "/api/product-categories/"

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(formData)
    }).done(function (response) {
        toastr.info('New category was successfully added.');
        $('#category_name').val('');
        $('#product_categories').append(new Option(response.name, response.id))
    }).fail(function () {
        toastr.error('Category was not added! Please try again.');
    })
}

$(document).ready(function () {
    $('.mdb-select').materialSelect();
});

$('#generate_product_code_checkbox').change(function () {
    generateProductCode(this);
});

$('#add-product-form').on('submit', function (e) {
    e.preventDefault();
    addProductDetails(this);
});

$('#discount_price, #mrp').keyup(function () {
    discount_percent_selector.val(((mrp_selector.val() - discount_price_selector.val()) * 100)/mrp_selector.val())
});

discount_percent_selector.keyup(function () {
    discount_price_selector.val(mrp_selector.val()*(1 - discount_percent_selector.val()/100))
});

$('#add-category-button').click(function () {
    addCategory();
})

