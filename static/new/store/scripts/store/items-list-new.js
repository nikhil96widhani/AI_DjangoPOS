const max_val = 100000000
let type = "list"
let search
$(document).ready(function () {
    getcategories()
    search = $("#search").attr('data-id');
    $("#search_box").val(search)
    pagination("",0, max_val,  1)


});

$(document).on('click', '.pagination-select', function(){
    let curr_page = $(this).attr('data-page-no');
    let categories = $(this).attr('data-categories');
    let mrp_range = get_mrp_range();
    pagination(categories, mrp_range[0], mrp_range[1], curr_page)
});

$(document).on('click', '.view-data', function(){
    type = $(this).data('id');
    $(this).addClass('active').siblings().removeClass('active');
    apply_filter();
});



function get_mrp_range() {
    let min_mrp = $('#min_mrp').val()
    let max_mrp = $('#max_mrp').val()
    if (min_mrp=="" && max_mrp=="") {
        min_mrp = 0; max_mrp = max_val;
    }
    else if (max_mrp == "") max_mrp = max_val;
    else min_mrp = 0;
    return [min_mrp, max_mrp];
}

function apply_filter() {
    let checkbox_value = new Array();

    $("input:checkbox[name=category]:checked").each(function () {
        console.log($(this).val())
        checkbox_value.push($(this).val());
    });
    let mrp_range = get_mrp_range();
    pagination(checkbox_value, mrp_range[0], mrp_range[1], 1)
}








function pagination(category, min_mrp, max_mrp, curr_page) {

    // let URL = '/api/store-products/pageSize=5&page=' + curr_page;
    //
    // if (category) URL += '&category__in=' + category

    $.ajax({

        url: '/api/store-products/?category__in=' + category + '&search=' + search + '&type=' + type + '&mrp=' + min_mrp + ',' + max_mrp  + '&page=' + curr_page,

        type: "GET",

        dataType: "json", success: function (data) {

            if (type === "list") {
                $('#data-container').html(template_list(data));
            }
            else if (type === "grid") {
                $('#data-container').html(template_grid(data));
            }

            pagination_datable(category, curr_page, data['next']);
            $('html, body').animate({scrollTop: 0}, 0);
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}