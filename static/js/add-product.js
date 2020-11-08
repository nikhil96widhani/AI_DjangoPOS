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