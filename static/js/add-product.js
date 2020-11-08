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