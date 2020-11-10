$(document).ready(function () {
    loadProductsData();
    addCategoriesToInput(product_category_selector);
    // $('.mdb-select').materialSelect();
});

$('#edit-product-form').on('submit', function (e) {
    e.preventDefault();
    postCategories(product_category_selector.val().split(",")).then(r => updateProductDetails(this));
});

$('#product-delete-yes').on('click', function (e) {
    deleteProduct();
});