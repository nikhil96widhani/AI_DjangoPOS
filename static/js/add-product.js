const discount_price_selector = $('#discount_price')
const discount_percent_selector = $('#discount_percent')
const mrp_selector = $('#mrp')
const product_category_selector = $('#product_categories');

function addProductDetails(form) {
    const formData = getFormData($(form));
    formData["product_code"] = $('#product_code').val();
    formData["category"] = product_category_selector.val().split(",");
    formData["expiry_date"] = $('#expiry_date').val();
    if (formData["expiry_date"] === "") {
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
    }).always(addCategoriesToInput(product_category_selector))
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

function addCategoriesToInput(input_selector) {
    let url = '/api/product-categories/'
    $.getJSON(url, {}, function (category_data) {
        console.log(category_data);
        if (input_selector.data('tagator') !== undefined) {
            input_selector.tagator('destroy');
        }
        input_selector.tagator({
            autocomplete: category_data.categories,
            useDimmer: true,
            showAllOptionsOnFocus: true
        });
    });
}

async function postCategories(category_array) {
    let url = "/api/product-categories/"

    $.each(category_array, function (i, category_name) {
        $.ajax(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            data: JSON.stringify({'name': category_name})
        }).done(function () {
            console.log('New category was successfully added.');
        }).fail(function () {
            toastr.error(`New Category (${category_name}) was not added! Please try again.`);
        })
    });
}

$(document).ready(function () {
    addCategoriesToInput(product_category_selector)
    $('.mdb-select').materialSelect();
});

$('#generate_product_code_checkbox').change(function () {
    generateProductCode(this);
});

$('#add-product-form').on('submit', function (e) {
    e.preventDefault();
    postCategories(product_category_selector.val().split(",")).then(r => addProductDetails(this));
});

$('#discount_price, #mrp').keyup(function () {
    discount_percent_selector.val(((mrp_selector.val() - discount_price_selector.val()) * 100) / mrp_selector.val())
});

discount_percent_selector.keyup(function () {
    discount_price_selector.val(mrp_selector.val() * (1 - discount_percent_selector.val() / 100))
});

$('#add-category-button').click(function () {
    addCategory();
})

