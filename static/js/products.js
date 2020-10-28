const product_categories = {}
let product_code_to_update, product_code_to_delete;

function loadProductsData() {
    let url = '/api/products/';
    let html;
    $.getJSON(url, {}, function (response) {
        console.log(response)
        let dataTable = $("#products-data-table");

        getProductCategoriesInDictionary(response.product_categories);

        $.each(response.products, function (i, item) {
            const category_array = [];
            $.each(item.category, function (index, category) {
                category_array.push(product_categories[category]);
            })
            html = `${html}<tr>
                    <td>${item.product_code}</td>
                    <td>${item.name}</td>
                    <td>${item.cost}</td>
                    <td>${item.mrp}</td>
                    <td>${item.discount_price}</td>
                    <td>${item.quantity}</td>
                    <td>${item.weight}</td>
                    <td>${item.expiry_date}</td>
                    <td>${category_array.join(", ")}</td>
                    <td>
                    <a class="pr-3" href="/pos/product-label/${item.product_code}"><i class="fa fa-print" aria-hidden="true"></i></a>
                    <a class="pr-3"><i class="fa fa-pencil-square-o" aria-hidden="true" data-toggle="modal" data-target="#editProductModalForm" onclick="editProductDetails('${item.product_code}')"></i></a>
                    <a class="pr-3"><i class="fa fa-trash-o" aria-hidden="true" data-toggle="modal" data-target="#deleteProductPrompt" onclick="deleteProductConfirmation('${item.product_code}', '${item.name}')"></i></a>
                    </td>
                </tr>`
        })
        dataTable.DataTable().destroy();
        $('#products-table-body').empty().append(html);
        tablePagination(dataTable);
        addProductCategoriesInSelect($('#product_category'), response.product_categories);
        addProductCategoriesInSelect($('#edit_product_category'), response.product_categories);
    });
}

function getProductCategoriesInDictionary(category_data) {
    $.map(category_data, function (n, i) {
        product_categories[n['id']] = n['name'];
    });
}

function tablePagination(dataTable) {
    dataTable.DataTable({
        "pagingType": "full_numbers",
        "aaSorting": [],
        columnDefs: [{
            orderable: false,
            targets: [8, 9]
        }]
    });
}

function addProductCategoriesInSelect(selector, category_data) {
    let product_category_selector = selector;
    product_category_selector.empty();
    product_category_selector.append('<option value="" disabled selected>Select Categories</option>');
    $.each(category_data, function (i, item) {
        product_category_selector.append(new Option(item.name, item.id))
    });
}

function addProductDetails(form) {
    const formData = getFormData($(form));
    formData["product_code"] = $('#product_code').val();
    formData["category"] = $('#product_category').val();

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
        loadProductsData();
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
            $("label[for='" + product_code_text_field.attr('id') + "']").addClass('active');
            product_code_text_field.val(response.unique_product_code);
            product_code_text_field.addClass('valid');
            product_code_text_field.attr('disabled', 'disabled');
        });
    } else {
        $("label[for='" + product_code_text_field.attr('id') + "']").removeClass('active');
        product_code_text_field.removeClass('valid');
        product_code_text_field.val('');
        product_code_text_field.removeAttr('disabled');
    }
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
        loadProductsData();
    }).fail(function () {
        toastr.error('Product details were not updated! Please try again.');
    })
}

function deleteProductConfirmation(product_code, product_name='test'){
    product_code_to_delete = product_code;
    let url = '/api/products/' + product_code_to_delete + '/';

    $('#static-product-code-delete').empty().html(product_code_to_delete);
    $('#static-product-name-delete').empty().html(product_name);
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
        loadProductsData();
    }).fail(function () {
        toastr.error('Unable to delete product! Please try again.');
    })
}

/*---------------------Events---------------------*/
$(document).ready(function () {
    loadProductsData();
    $('.mdb-select').materialSelect();
});

$('#add-product-form').on('submit', function (e) {
    e.preventDefault();
    addProductDetails(this);
});

$('#edit-product-form').on('submit', function (e) {
    e.preventDefault();
    updateProductDetails(this);
});

$('#product-delete-yes').on('click', function (e) {
    deleteProduct();
});

$('#generate_product_code_checkbox').change(function () {
    generateProductCode(this);
});



