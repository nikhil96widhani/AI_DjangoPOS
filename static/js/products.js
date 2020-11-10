let product_code_to_update, product_code_to_delete;
const dataTable = $("#products-datatable");
const discount_price_selector = $('#discount_price')
const discount_percent_selector = $('#discount_percent')
const mrp_selector = $('#mrp')
const product_category_selector = $('#product_categories');

const addProductDetails = function (form) {
    console.log('Add product started')
    const formData = getFormData($(form));
    formData["product_code"] = $('#product_code').val();
    if (formData["category"] === null) {
        formData["category"] = [];
    } else formData["category"] = product_category_selector.val().split(",");
    console.log(formData);
    let url = "/api/add-product/"

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(formData),
        success: function (data) {
            console.log(data);
            toastr.info('Product was successfully added.');
            $('#add-product-form').trigger('reset');
            $('#product_code').removeAttr('disabled');
            product_category_selector.tagator('refresh');
        },
        error: function () {
            toastr.error('Product was not saved! Please try again.');
        },
        complete: function () {
            addCategoriesToInput(product_category_selector);
        }
    });
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


const postCategories = function (category_array) {
    const r = $.Deferred();
    console.log('Category add started.')
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
    setTimeout(function () {
        r.resolve();
    }, 100);
    return r;
};

function loadProductsData() {
    const table = dataTable.DataTable({
        'serverSide': true,
        'ajax': '/api/products/?format=datatables',
        responsive: true,
        keys: true,
        dom: "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
            "<'row'<'col-sm-12'tr>>" +
            "<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-2'><'col-sm-12 col-md-5'p>>" +
            "<'row'<'col text-right pt-2'B>>",
        buttons: [
            'copy', 'excel', 'pdf', 'print'
        ],
        'columns': [
            {'data': 'product_code'},
            {'data': 'name'},
            {'data': 'cost'},
            {'data': 'mrp'},
            {'data': 'discount_price'},
            {'data': 'quantity'},
            {'data': 'weight'},
            {'data': 'company'},
            {'data': 'rack_number'},
            {
                'data': 'product_code', sortable: false, render: function (data, type, row) {
                    return `<a class="pr-3" href="/pos/product-label/${data}"><i class="fa fa-print" aria-hidden="true"></i></a>
                            <a class="pr-3"><i class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal" data-target="#editProductModalForm" onclick="editProductDetails('${data}')"></i></a>
                            <a class=""><i class="fa fa-trash-o" aria-hidden="true" data-toggle="modal" data-target="#deleteProductPrompt" onclick="deleteProductConfirmation('${data}')"></i></a>`;
                }
            }
        ]
    });
}

function editProductDetails(product_code) {
    product_code_to_update = product_code;
    let url = '/api/products/' + product_code_to_update;
    $('#static-product-code').empty().html(product_code_to_update);

    $.getJSON(url, {}, function (response) {
        console.log(response);
        $.each(response, function (key, value) {
            let field_selector = $(`#edit-product-form [name="${key}"]`);
            field_selector.val(value);
        })
        console.log(response.category.join())
        product_category_selector.val(response.category.join())
        product_category_selector.tagator('refresh');
    });
}

function updateProductDetails(form) {
    const formData = getFormData($(form));
    formData["product_code"] = product_code_to_update;
    formData["category"] = product_category_selector.val().split(",");
    if (formData["expiry_date"] === "") {
        formData["expiry_date"] = null;
    }

    console.log(formData);
    let url = "/api/products/" + product_code_to_update + "/";

    $.ajax(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(formData)
    }).done(function () {
        toastr.info('Product details were successfully updated.');
        $('.close').click();
        dataTable.DataTable().draw(false);
    }).fail(function () {
        toastr.error('Product details were not updated! Please try again.');
    })
}

function deleteProductConfirmation(product_code) {
    product_code_to_delete = product_code;
    $('#static-product-code-delete').empty().html(product_code_to_delete);
}

function deleteProduct() {
    let url = "/api/products/" + product_code_to_delete + "/";

    $.ajax(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
    }).done(function () {
        toastr.info('Product was deleted successfully.');
        $('.close').click();
        dataTable.DataTable().draw(false);
    }).fail(function () {
        toastr.error('Unable to delete product! Please try again.');
    })
}

/*Common Events for Both Pages*/
discount_price_selector.keyup(function () {
    discount_percent_selector.val(((mrp_selector.val() - discount_price_selector.val()) * 100) / mrp_selector.val())
});

$('#discount_percent, #mrp').keyup(function () {
    discount_price_selector.val(mrp_selector.val() * (1 - discount_percent_selector.val() / 100))
});


