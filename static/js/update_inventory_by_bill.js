let product_code_to_update, product_code_to_delete, variation_id_to_update, variation_id_to_delete, action_required,
    updated_variation_id;

function getBillDetails() {

    let url = "/api/stock-bill/"

    $.ajax(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        success: function (data) {
            // toastr.success(data.bill_date_ordered)
            document.getElementById("bill_name").value = data.bill_name;
            document.getElementById("vendor_name").value = data.bill_vendor;
            document.getElementById("date_bill").value = data.bill_date_ordered;
            // console.log(data)
        },
        error: function () {
            toastr.error('An error occurred please check the value entered');
        },
        // complete: function () {
        // }
    })
}

const dataTable = $("#bill-datatable");
let updated_product_code = 0;
let updated_product_id = 0;
let total_cart_value = 0;

function loadBillItemsTable() {
    let url = '/api/stock-bill/?format=datatables';

    return dataTable.DataTable({
        ajax: {
            'url': url,
            'dataSrc': 'data.bill_items',
        },
        "language": {
            "emptyTable": '<div class="alert alert-primary text-center" role="alert">No products in the Bill. Start by adding some products!</div>'
        },
        "initComplete": function () {
            const myCustomScrollbar = document.querySelector('#bill-datatable_wrapper .dataTables_scrollBody');
            new PerfectScrollbar(myCustomScrollbar);
        },
        "scrollY": "48vh",
        "paging": false,
        'dom': "t",
        'fixedHeader': {
            header: true,
            footer: true
        },
        "rowCallback": function (row, data, dataIndex) {
            console.log(typeof updated_variation_id)
            console.log(typeof data.id)
            if (data.id === updated_variation_id) {
                $(row).addClass('clicked');
                updated_variation_id = 0;
            }
        },
        'columns': [
            {
                'data': 'id', sortable: false, 'width': '2%', render: function (data, type, row, meta) {
                    if (row.is_new_variation === false) {
                        return `<span class="dot success-color text-white font-weight-bold">${meta.row + meta.settings._iDisplayStart + 1}</span>`;
                    } else if (row.is_new_variation === true) {
                        return `<span class="dot primary-color text-white font-weight-bold">${meta.row + meta.settings._iDisplayStart + 1}</span>`;
                    } else {
                        return `<span class="dot bg-light text-white font-weight-bold">${meta.row + meta.settings._iDisplayStart + 1}</span>`;
                    }
                }
            },
            {'data': 'product_code', sortable: false, 'width': '8%'},
            {'data': 'name', 'width': '30%'},
            {
                'data': 'cost', 'width': '7%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="cost" value="${data}" data-variation-id=${row.id}></div>`
                }},
            {'data': 'mrp', 'width': '7%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="mrp" value="${data}" data-variation-id=${row.id}></div>`
                }},
            {'data': 'discount_price', 'width': '7%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="discount_price" value="${data}" data-variation-id=${row.id}></div>`
                }},
            {
                'data': 'stock', 'width': '8%', render: function (data, type, full) {
                    if (data === null) return "-";
                    if (full['quantity_unit'] === null) return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="stock" value="${data}" data-variation-id=${full.id}></div>`;
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="stock" value="${data}" data-variation-id=${full.id}>
                              <span class="pl-2">${full['quantity_unit']}</span></div>`;
                }
            },
            {
                'data': 'weight', 'width': '8%', render: function (data, type, full) {
                    if (data === null) return "-";
                    if (full['weight_unit'] === null) return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="weight" value="${data}" data-variation-id=${full.id}></div>`;
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="weight" value="${data}" data-variation-id=${full.id}>
                              <span class="pl-2">${full['weight_unit']}</span></div>`;
                }
            },
            {'data': 'expiry_date', 'width': '7%', render: function (data, type, row) {
                return `<input id="date_bill" type="date" class="form-control editor-table bill-item-updater" name="expiry_date" value="${data}" data-variation-id=${row.id} />`
                }},
            {'data': 'id', sortable: false, 'width': '7%', render: function (data, type, row) {
                    return `<button class="btn btn-danger btn-sm btn-rounded m-0 py-1 px-2" 
                                onclick="updateBillDetails({'action':'delete_billItem', 'billItem_id' : ${data}}, true)"
                                ><i class="fas fa-trash"></i></button>`
                }
            },
        ],
        'drawCallback': function () {
            let api = this.api();
            let json = api.ajax.json();


            // let html = `<tr><th class="table-info font-weight-500 h6">Total Quantity -
            //                 <span class="font-weight-bold">${json.data.order.get_cart_items_quantity}</span></th>
            //                 <th class="table-warning font-weight-500 h6">Total Amount -
            //                 <span class="font-weight-bold">₹${json.data.order.get_cart_revenue}</span></th>
            //                 <th class="table-success font-weight-500 h6">Cart Discount -
            //                 <span class="font-weight-bold">${discount}</span>${remove_discount}</th>
            //             </tr>`
            let html = `<div class="col-sm-4 table-info font-weight-500 text-center py-3 h6">Total Quantity -  <span class="font-weight-bold">${json.data.bill_items_quantity}</span></div>
                        <div class="col-sm-4 table-warning font-weight-500 text-center py-3 h6">Total Purchase Cost -  <span class="font-weight-bold"><i class="las la-rupee-sign"></i>${json.data.bill_total}</span></div>
                        <div class="col-sm-4 table-success font-weight-500 text-center py-3 h6">Total MRP -  <span class="font-weight-bold"><i class="las la-rupee-sign"></i>${json.data.bill_mrp_total}</span></div>`
            // $(dataTable.DataTable().table().footer()).html(html);
            $('#total-values-div').html(html);

        },
    });
}


function updateBillDetails(data_json, reload_table) {
    console.log(JSON.stringify(data_json))
    let url = "/api/stock-bill/"

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(data_json),
        success: function (data) {
            toastr.success(data);
            if (reload_table === true) {
                dataTable.DataTable().draw('page');
            }
            // console.log(data)
        },
        error: function () {
            toastr.error('An error occurred please check the value entered');
        },
        // complete: function () {
        // }
    })
}

const prepareAndFillProductVariationSearchTableData = (data) => {
    $('.product-variation-searchModal').modal('show');
    let final_data = []
    if (typeof data === "string") {
        let url = '/api/product-variation-search/';
        $.getJSON(url, {'search_term': data}, response => {
            for (const variation of response) {
                const temp = {
                    'variation_id': variation.id,
                    'product_code': variation.product.product_code,
                    'name': variation.product.name,
                    'cost': variation.cost,
                    'mrp': variation.mrp,
                    'discount_price': variation.discount_price,
                    'quantity': variation.quantity,
                    'weight': variation.weight
                }
                final_data = [...final_data, temp]
            }
            fillProductVariationSearchTable(final_data);
        })
    } else {
        const product = data.product_data
        for (const variation of data.variation_data) {
            const temp = {
                'variation_id': variation.id,
                'product_code': variation.product,
                'name': product.name,
                'cost': variation.cost,
                'mrp': variation.mrp,
                'discount_price': variation.discount_price,
                'quantity': variation.quantity,
                'weight': variation.weight
            }
            final_data = [...final_data, temp]
        }
        fillProductVariationSearchTable(final_data);
    }
    // console.log(final_data);
}

const fillProductVariationSearchTable = final_data => {
    console.log(final_data)
    if (final_data === undefined || final_data.length === 0) {
        const html = `<div class="alert alert-secondary text-center" role="alert">No Products Found</div>`
        $("#product-search-datatable").html(html);
    } else {
        const th = ["Product Code", "Product Name", "Cost", "MRP", "Discounted Price", "Quantity", "Weight", "Actions",]
        let table_header = `<table class="table nowrap text-center custom-datatable" style="width:100%">
                        <thead>
                            <tr style="background: #e2e6ea">
                                ${th.map(h => `<th>${h}</th>`).join('')}
                            </tr>
                        </thead><tbody>`
        let table_data = final_data.map(row => {
            return `<tr>
                    <td>${row.product_code}</td>
                    <td>${row.name}</td>
                    <td>${row.cost}</td>
                    <td>${row.mrp}</td>
                    <td>${row.discount_price}</td>
                    <td>${row.quantity}</td>
                    <td>${row.weight}</td>
                    <td>
                        <button type="button" class="btn btn-primary btn-sm m-0 p-1 px-2"
                        onclick="addBillItemToBill(${row.variation_id}, true); $('.product-variation-searchModal').modal('hide');"
                        ><i class="fas fa-plus"></i></button>
                        <button type="button" class="btn btn-primary btn-sm m-0 p-1 px-2" 
                                data-toggle="modal" data-target="#addVariationModalForm" onclick="addAndUpdateVariationButtonAction('edit', '${row.variation_id}', '${row.product_code}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </td>
                </tr>`;
        }).join('');
        let table_footer = `</tbody></table>`;
        $("#product-search-datatable").html(table_header + table_data + table_footer);
    }
}

function product_variation_search(value) {
    const th = ["Product Code", "Product Name", "Cost", "MRP", "Discounted Price", "Quantity", "Weight", "Actions",]
    let url = '/api/product-variation-search/';
    let thead_code = `<table class="table nowrap text-center custom-datatable"
                       style="width:100%">
                        <thead>
                        <tr style="background: #e2e6ea">
                            ${th.map(h => `<th>${h}</th>`).join('')}
                        </tr>
                        </thead><tbody>`
    let tfoot_code = `</tbody></table>`

    $.getJSON(url, {'search_term': value}, (response) => {
        let trHTML = '';
        if (response === undefined || response.length === 0) {
            trHTML += `<div class="alert alert-secondary text-center" role="alert">No Products Found</div>`
            $("#product-search-datatable").empty().append(trHTML);
        } else {
            $.each(response, function (e, item) {
                trHTML += `<tr>
                        <td>${item.product.product_code}</td>
                        <td>${item.product.name}</td>
                        <td>${item.cost}</td>
                        <td>${item.mrp}</td>
                        <td>${item.discount_price}</td>
                        <td>${item.quantity}</td>
                        <td>${item.weight}</td>
                        <td>
                            <button type="button" class="btn btn-primary btn-sm m-0 p-1 px-2"
                            onclick="addBillItemToBill(${item.id}, true); $('.product-variation-searchModal').modal('hide');"
                            ><i class="fas fa-plus"></i></button>
                            <button type="button" class="btn btn-primary btn-sm m-0 p-1 px-2" 
                                    data-toggle="modal" data-target="#addVariationModalForm" onclick="addAndUpdateVariationButtonAction('edit', '${item.id}', '${item.product.product_code}')">
                                <i class="fas fa-edit"></i>
                            </button>
                        </td>
                    </tr>`
            })
            $("#product-search-datatable").empty().append(thead_code + trHTML + tfoot_code);
        }
    });
}

const editVariationAndAddToBillItems = (variation_form_selector) => {
    const variation_form_data = getFormData($(variation_form_selector));
    variation_form_data['product'] = product_code_to_update;

    const data = {'variation_data': variation_form_data}
    console.log(data);

    let url = "/api/add-product-with-variation/";

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(data),
        success: function (data) {
            toastr.info('Variation was successfully added.');
            $('.close').click();
            dataTable.DataTable().draw(false);
        },
        error: function () {
            toastr.error('Variation details were not added! Please try again.');
        },
    });
}

function addAndUpdateVariationButtonAction(action, variation_id, product_code) {
    // $('#addProductModalForm').modal('hide');
    $('.modal').modal('hide');
    variation_id_to_update = variation_id;
    product_code_to_update = product_code;
    action_required = action;

    let url = '/api/variations/' + variation_id_to_update;
    $(`#add-variation-static-product-code`).empty().html(product_code_to_update);

    const product_category_selector = `#add-variation_product_categories`

    $.getJSON(url, {}, function (response) {
        console.log(response);
        $.each(response, function (key, value) {
            let field_selector = $(`#add-variation-variation-form [name="${key}"]`);
            field_selector.val(value);
        })
        $.each(response.product, function (key, value) {
            let field_selector = $(`#add-variation-product-form [name="${key}"]`);
            field_selector.val(value);
        })
        console.log(response.product.category.join())
        $(product_category_selector).val(response.product.category.join())
        $(product_category_selector).tagator('refresh');
    });
}

const productFormHandler = (action) => {
    const product_form_selector = `#add-variation-product-form`
    const variation_form_selector = `#add-variation-variation-form`

    if (!$(product_form_selector)[0].checkValidity()) {
        $(product_form_selector)[0].reportValidity();
    } else if (!$(variation_form_selector)[0].checkValidity()) {
        $(variation_form_selector)[0].reportValidity()
    } else {
        // if (action === 'add') {
        //     addProductDetails(product_form_selector, variation_form_selector);
        // } else if (action === 'edit') {
        //     updateProductDetails(product_form_selector, variation_form_selector)
        // } else if (action === 'add-variation') {
        //     addVariation(variation_form_selector)
        // }
        console.log(action)
    }
}

$('#add-variation-product-form-submit').click(function () {
    productFormHandler(action_required);
});

const addBillItemToBill = (product_code_or_variation, is_variation = false) => {
    let url = "/api/add-bill-item/"
    let data = {'product_code': product_code_or_variation}
    if (is_variation) {
        data = {'variation_id': product_code_or_variation}
    }

    $.ajax(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        data: JSON.stringify(data),
        success: function (data) {
            if (data.multiple_variation_exists) {
                toastr.info('Multiple Variation Exists');
                // product_variation_search(product_code_or_variation)
                prepareAndFillProductVariationSearchTableData(data)
            } else if (data.status === 'error') {
                toastr.error(data.response);
            } else {
                console.log(data);
                dataTable.DataTable().draw(false);
            }
        },
        error: function () {
            toastr.error('Error!');
        },
    });
}

// $(function () {
//     $(document).pos();
//     $(document).on('scan.pos.barcode', function (event) {
//         console.log("from barcode", event.code)
//         addBillItemToBill(event.code);
//     });
// });

// Callbacks
$('.bill-data-updater').on('change', function () {
    let data_json = {'action': 'update_bill', [this.name]: this.value}
    updateBillDetails(data_json, false)
});

$('#bill-datatable').on('change', '.bill-item-updater', function() {
    let data_json = {'action':'update_bill_item', 'id': this.getAttribute('data-variation-id'), [this.name] : this.value  }
    updateBillDetails(data_json, true)
    updated_variation_id = parseInt(this.getAttribute('data-variation-id'));
});

$("#variation-search-input").on("input", function () {
    let value = $(this).val().toLowerCase();
    // product_variation_search(value)
    prepareAndFillProductVariationSearchTableData(value)
});

$("#complete-bill").on("click", function () {
    updateBillDetails({'action': 'complete_and_update'}, false)
});

// Initialize with options
onScan.attachTo(document, {
    suffixKeyCodes: [13], // enter-key expected at the end of a scan
    reactToPaste: true, // Compatibility to built-in scanners in paste-mode (as opposed to keyboard-mode)
    onScan: function(sCode) { // Alternative to document.addEventListener('scan')
        console.log(sCode);
        addBillItemToBill(sCode);
    },
});

$(document).ready(function () {
    getBillDetails();
    loadBillItemsTable();
});