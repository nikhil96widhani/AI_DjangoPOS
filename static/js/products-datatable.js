const product_categories = {}
let product_code_to_update, product_code_to_delete;
const dataTable = $("#products-datatable");

function loadProductsData() {
    var table = dataTable.DataTable({
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
                'data': 'product_code', sortable:false, render: function (data, type, row) {
                    return `<a class="pr-3" href="/pos/product-label/${data}"><i class="fa fa-print" aria-hidden="true"></i></a>
                            <a class="pr-3"><i class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal" data-target="#editProductModalForm" onclick="editProductDetails(${data})"></i></a>
                            <a class=""><i class="fa fa-trash-o" aria-hidden="true" data-toggle="modal" data-target="#deleteProductPrompt" onclick="deleteProductConfirmation('${data}')"></i></a>`;
                }
            }
        ]
    });
    table.buttons().container().appendTo($('.col-sm-6:eq(0)', table.table().container()));
    addProductCategoriesInSelect($('#edit_product_category'));
}

function editProductDetails(product_code) {
    product_code_to_update = product_code;
    let url = '/api/products/' + product_code_to_update;
    $('#static-product-code').empty().html(product_code_to_update);

    $.getJSON(url, {}, function (response) {
        console.log(response);
        $.each(response, function (key, value) {
            let field_selector = $(`#edit-product-form [name="${key}"]`);
            if (value) {
                $("label[for='" + field_selector.attr('id') + "']").addClass('active');
                field_selector.val(value);
                field_selector.addClass('valid');
            }
        })
    });
}

function updateProductDetails(form) {
    const formData = getFormData($(form));
    formData["product_code"] = product_code_to_update;
    formData["category"] = $('#edit_product_category').val();

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

function addProductCategoriesInSelect(selector) {
    let product_category_selector = selector;
    product_category_selector.empty();
    product_category_selector.append('<option value="" disabled selected>Select Categories</option>');
    let url = '/api/product-categories/'
    $.getJSON(url, {}, function (category_data) {
        $.each(category_data, function (i, item) {
            product_category_selector.append(new Option(item.name, item.id))
        });
    });
}

/*---------------------Events---------------------*/
$(document).ready(function () {
    loadProductsData();
    $('.mdb-select').materialSelect();
});

$('#edit-product-form').on('submit', function (e) {
    e.preventDefault();
    updateProductDetails(this);
});

$('#product-delete-yes').on('click', function (e) {
    deleteProduct();
});