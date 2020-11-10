$(document).ready(function () {
    addCategoriesToInput(product_category_selector)
    // $('.mdb-select').materialSelect();
});

$('#generate_product_code_checkbox').change(function () {
    generateProductCode(this);
});

$('#add-product-form').on('submit', function (e) {
    e.preventDefault();
    // postCategories(product_category_selector.val().split(",")).then(r => addProductDetails(this));
    // const categories = product_category_selector.val();
    // console.log(product_category_selector.val());
    // let categories_array;
    // if (categories.length === 0) {
    //     categories_array = []
    // } else categories_array = categories.split(",");
    // console.log("Array - " + categories_array);
    // $.when(postCategories(categories_array)).done(addProductDetails(this));
    // postCategories(categories_array).done(addProductDetails(this));
    addProductDetails(this);
});