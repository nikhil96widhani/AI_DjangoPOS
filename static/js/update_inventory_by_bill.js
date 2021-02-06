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
            if (data.product_code === updated_product_code || data.id === updated_product_id ) {
                $(row).addClass('clicked');
                updated_product_code = 0;
                updated_product_id = 0;

            }
        },
        'columns': [
            {
                'data': 'id', sortable: false, 'width': '2%', render: function (data, type, row, meta) {
                    if (row.is_new_variation === false){
                        return `<span class="dot success-color text-white font-weight-bold">${meta.row + meta.settings._iDisplayStart + 1}</span>`;
                        }
                    else if (row.is_new_variation === true){
                        return `<span class="dot primary-color text-white font-weight-bold">${meta.row + meta.settings._iDisplayStart + 1}</span>`;
                    }
                    else {
                        return `<span class="dot bg-light text-white font-weight-bold">${meta.row + meta.settings._iDisplayStart + 1}</span>`;
                    }
                }
            },
            {'data': 'product_code', sortable: false, 'width': '8%'},
            {'data': 'name', 'width': '30%'},
            {'data': 'cost', 'width': '7%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="cost" value="${data}" alt=${row.id}></div>`
                }},
            {'data': 'mrp', 'width': '7%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="mrp" value="${data}" alt=${row.id}></div>`
                }},
            {'data': 'discount_price', 'width': '7%', render: function (data, type, row) {
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="discount_price" value="${data}" alt=${row.id}></div>`
                }},
            {
                'data': 'stock', 'width': '8%', render: function (data, type, full) {
                    if (data === null) return "-";
                    if (full['quantity_unit'] === null) return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="stock" value="${data}" alt=${full.id}></div>`;
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="stock" value="${data}" alt=${full.id}>
                              <span class="pl-2">${full['quantity_unit']}</span></div>`;
                }
            },
            {
                'data': 'weight', 'width': '8%', render: function (data, type, full) {
                    if (data === null) return "-";
                    if (full['weight_unit'] === null) return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="weight" value="${data}" alt=${full.id}></div>`;
                    return `<div class="input-group" style="width: 100%">
                              <input class="form-control input-sm quantity editor-table px-1 text-center bill-item-updater" 
                              min="0" type="number" name="weight" value="${data}" alt=${full.id}>
                              <span class="pl-2">${full['weight_unit']}</span></div>`;
                }
            },
            {'data': 'expiry_date', 'width': '7%', render: function (data, type, row) {
                return `<input id="date_bill" type="date" class="form-control editor-table bill-item-updater" name="expiry_date" value="${data}" alt=${row.id} />`
                }},
            {'data': 'weight_unit', sortable: false, 'width': '7%', render: function (data, type, row) {
                return 'print'
                }},
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


function updateBillDetails(data_json) {
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
            // console.log(data)
        },
        error: function () {
            toastr.error('An error occurred please check the value entered');
        },
        // complete: function () {
        // }
    })
}

$('.bill-data-updater').on('change',function() {
    let data_json = {'action':'update_bill', [this.name] : this.value}
    updateBillDetails(data_json)
});

$('#bill-datatable').on('change', '.bill-item-updater', function() {
    let data_json = {'action':'update_bill_item', 'id': this.alt, [this.name] : this.value  }
    updateBillDetails(data_json)
    dataTable.DataTable().draw('page');
});

$(document).ready(function () {
    getBillDetails();
    loadBillItemsTable();
});
