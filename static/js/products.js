const product_categories = {}
const product_codes = []

function loadProductsData() {
    let url = '/api/products/';
    var html;

    $.getJSON(url, {}, function (response) {
        console.log(response)
        $.each(response, function (i, item) {
            product_codes.push(item.product_code);
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
                    <td>${category_array.join(", ")}</td>
                    <td><i class="fa fa-pencil-square-o" aria-hidden="true"></i></td>
                </tr>`
        });
        $("#products-table-body").html(html)
    }).done(function () {
        //on return, add here
        $('#paginationFullNumbers').DataTable({
            "pagingType": "full_numbers",
            "aaSorting": [],
            columnDefs: [{
                orderable: false,
                targets: [7, 8]
            }]
        });
    });
}

async function getProductCategories() {
    let url = '/api/product-categories/';

    $.getJSON(url, {}, function (response) {
        $.map(response, function (n, i) {
            product_categories[n['id']] = n['name'];
        });
    });
}

function addProductCategoriesInSelect() {
    let url = '/api/product-categories/';

    $.getJSON(url, {}, function (response) {
        $.each(response, function (i, item) {
            $('#product_category').append(new Option(item.name, item.id))
        });
    });
}

function addProduct() {
    let form = $("#add-product-form");
    form.preventDefault();
    let formData = JSON.stringify(form.serializeArray());
    console.log(formData);
}

$(document).ready(function () {
    getProductCategories().then(loadProductsData);
    addProductCategoriesInSelect();
    $('.mdb-select').materialSelect();
});

$('#add-product-form').on('submit', function (e) {
    e.preventDefault();

    const formData = getFormData($(this));
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
    }).fail(function () {
        toastr.error('Product was not saved! Please try again.');
    })
});

$('#generate_product_code_checkbox').change(function () {
    if (this.checked) {

    }
    $('#textbox1').val(this.checked);
});