function loadProductsData() {
    let url = '/api/products/';
    var html;

    $.getJSON(url, {}, function (response) {
        console.log(response)
        $.each(response, function (i, item) {
            console.log(item)
            var category_text = [];
            $.each(item.category, function (index, category) {
                category_text.push(category.name);
            })
            html = `${html}<tr>
                    <td>${item.product_code}</td>
                    <td>${item.name}</td>
                    <td>${item.cost}</td>
                    <td>${item.mrp}</td>
                    <td>${item.discount_price}</td>
                    <td>${item.quantity}</td>
                    <td>${item.weight}</td>
                    <td>${category_text.join(", ")}</td>
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

function disableSorting(columns) {
    $('#paginationFullNumbers').DataTable({
        "aaSorting": [],
        columnDefs: [{
            orderable: false,
            targets: columns
        }]
    });
    $('.dataTables_length').addClass('bs-select');
}

$(document).ready(function () {
    loadProductsData();
});