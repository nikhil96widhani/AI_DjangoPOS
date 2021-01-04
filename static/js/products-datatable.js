let product_code_to_update, product_code_to_delete;
const dataTable = $("#products-datatable");
const common_product_category_selector = $('.product_categories');
const edit_product_category_selector = $('#edit_product_categories');
const add_product_category_selector = $('#add_product_categories');

const addProductDetails = function (form) {
    const formData = getFormData($(form));
    formData["product_code"] = $('#product_code').val();
    if (formData["category"] === null) {
        formData["category"] = [];
    } else formData["category"] = add_product_category_selector.val().split(",");
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
            common_product_category_selector.tagator('refresh');
            dataTable.DataTable().draw(false);
        },
        error: function () {
            toastr.error('Product was not saved! Please try again.');
        },
        complete: function () {
            addCategoriesToInput(common_product_category_selector);
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

function loadProductsData() {
    return dataTable.DataTable({
        'ajax': '/api/products/?format=datatables',
        "fnInitComplete": function () {
            const myCustomScrollbar = document.querySelector('#products-datatable_wrapper .dataTables_scrollBody');
            const ps = new PerfectScrollbar(myCustomScrollbar);
        },
        select: true,
        'columns': [
            {'data': 'product_code',},
            {'data': 'name'},
            {'data': 'cost'},
            {'data': 'mrp'},
            {'data': 'discount_price'},
            {
                'data': 'quantity', render: function (data, type, full) {
                    if (data === null) return "-";
                    if (full['quantity_unit'] === null) return data;
                    return data + " " + full['quantity_unit'];
                }
            },
            {
                'data': 'weight', render: function (data, type, full) {
                    if (data === null) return "-";
                    if (full['weight_unit'] === null) return data;
                    return data + " " + full['weight_unit'];
                }
            },
            {'data': 'company', render: handleBlankData},
            {'data': 'rack_number', render: handleBlankData},
            {
                'data': 'product_code', sortable: false, render: function (data, type, row) {
                    return `<a class="pr-3" href="/pos/product-label/${data}" target="_blank"><i class="fa fa-print" aria-hidden="true"></i></a>
                            <a class="pr-3"><i class="fa fa-pen" aria-hidden="true" data-toggle="modal" data-target="#editProductModalForm" onclick="editProductDetails('${data}')"></i></a>
                            <a class=""><i class="fa fa-trash" aria-hidden="true" data-toggle="modal" data-target="#deleteProductPrompt" onclick="deleteProductConfirmation('${data}')"></i></a>`;
                }
            },
            {'data': 'quantity_unit', "visible": false},
            {'data': 'weight_unit', "visible": false}
        ],
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
        edit_product_category_selector.val(response.category.join())
        edit_product_category_selector.tagator('refresh');
    });
}

function updateProductDetails(form) {
    const formData = getFormData($(form));
    formData["product_code"] = product_code_to_update;
    if (formData["category"] === null) {
        formData["category"] = [];
    } else formData["category"] = edit_product_category_selector.val().split(",");
    console.log(formData);

    let url = "/api/products/" + product_code_to_update + "/";

    $.ajax(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(formData),
        success: function (data) {
            toastr.info('Product details were successfully updated.');
            $('.close').click();
            dataTable.DataTable().draw(false);
        },
        error: function () {
            toastr.error('Product details were not updated! Please try again.');
        },
        complete: function () {
            addCategoriesToInput(common_product_category_selector);
        }
    });
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

function changeDiscountPercent(discount_price_selector, discount_percent_selector, mrp_selector) {
    discount_percent_selector.val(roundToTwoDecimal(((mrp_selector.val() - discount_price_selector.val()) * 100) / mrp_selector.val()))
}

function changeDiscountPrice(discount_price_selector, discount_percent_selector, mrp_selector) {
    discount_price_selector.val(roundToTwoDecimal(mrp_selector.val() * (1 - discount_percent_selector.val() / 100)))
}


/**************************Events**************************/
$(document).ready(function () {
    $('#products-datatable thead tr').clone(true).appendTo('#products-datatable thead').attr("id", "advance-search-bar").attr("class", "d-none my-2");
    $('#products-datatable thead tr:eq(1) th').each(function (i) {
        const title = $(this).text();
        $(this).html(`<input type="text" class="form-control form-control-sm ml-1"/>`);
        if (i === 9) {
            $(this).html('<div class="mb-1 ml-4" id="advance-search-clear-button" type="button" onclick="resetAdvanceSearch()"><i class="fa fa-close" style="font-size: larger" aria-hidden="true"></i></div>');
        }
        $('input', this).on('keyup change', function () {
            if (table.column(i).search() !== this.value) {
                if (i === 1 && this.value !== ""){
                    table.column(i).search(this.value).draw();
                }
                else if (this.value !== "") {
                    table.column(i).search("^" + $(this).val(), true, false, true).draw();
                } else {
                    table.column(i).search(this.value).draw();
                }
            }
        });
    });
    const table = loadProductsData();
    addCategoriesToInput(common_product_category_selector)
});

/*Add Product Events*/
const add_discount_price_selector = $('#add_discount_price')
const add_discount_percent_selector = $('#add_discount_percent')
const add_mrp_selector = $('#add_mrp')

$('#generate_product_code_checkbox').change(function () {
    generateProductCode(this);
});

$('#add-product-form').on('submit', function (e) {
    e.preventDefault();
    addProductDetails(this);
});

add_discount_price_selector.on('input', function () {
    changeDiscountPercent(add_discount_price_selector, add_discount_percent_selector, add_mrp_selector)
});

$('#add_discount_percent, #add_mrp').on('input', function () {
    changeDiscountPrice(add_discount_price_selector, add_discount_percent_selector, add_mrp_selector)
});

/*Edit Product Events*/
const edit_discount_price_selector = $('#edit_discount_price')
const edit_discount_percent_selector = $('#edit_discount_percent')
const edit_mrp_selector = $('#edit_mrp')

$('#edit-product-form').on('submit', function (e) {
    e.preventDefault();
    updateProductDetails(this);
});

$('#product-delete-yes').on('click', function (e) {
    deleteProduct();
});

edit_discount_price_selector.on('input', function () {
    changeDiscountPercent(edit_discount_price_selector, edit_discount_percent_selector, edit_mrp_selector)
});

$('#edit_discount_percent, #edit_mrp').on('input', function () {
    changeDiscountPrice(edit_discount_price_selector, edit_discount_percent_selector, edit_mrp_selector)
});

$('.product_companies').autocomplete(
    {
        serviceUrl: '/api/product-companies',
    }
);