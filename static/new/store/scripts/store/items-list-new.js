const max_val = 100000000

$(document).ready(function () {
    getcategories()

    pagination("",0, max_val,  1)


});

$(document).on('click', '.pagination-select', function(){
    let curr_page = $(this).attr('data-page-no');
    let categories = $(this).attr('data-categories');
    let mrp_range = get_mrp_range();
    pagination(categories, mrp_range[0], mrp_range[1], curr_page)
});

async function getcategories() {

    // Storing response
    fetch('/api/store-product-categories/')
        .then(result =>{
            if (!result.ok) {
                console.log("problem")
                return
            }
            return result.json()
        })
        .then(data =>{
            let text = ``;
            for (var i = 0; i < data.length; i++) {
                text += `<label class="form-check mb-2">
                                            <input class="form-check-input" name="category" type="checkbox" value="${data[i]['category__name']}">
                                            <span class="form-check-label"> ${data[i]['category__name']} </span>
                                            <b class="badge rounded-pill bg-gray-dark float-end">${data[i]['count']}</b>
                                        </label> <!-- form-check end.// -->`;
            }
            // text += `<button class="btn btn-light w-100" type="button" onclick="apply_category()">Apply</button>`
            document.getElementById("category-container").innerHTML = text;

        })
        .catch(error => {
            console.log(error)
        })

}

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

function template(data) {
    let count = data['count']
    data = data['results']
    document.getElementById("item-count").innerHTML = count + " Items found";
    let text = ``;
    // {% url 'store_items_detail' %}
    for (let i = 0; i < data.length; i++) {
        text += `<article class="card card-product-list" >
                            <div class="row g-0" >
                            <aside class="col-xl-3 col-md-4">
                                <a href="item-detail/?pk=${data[i].product_code}" class="img-wrap" data-id = "${data[i].product_code}" onclick="Url(this)"> <img src="${data[i].get_image}"> </a>
                            </aside> <!-- col.// -->
                            <div class="col-xl-6 col-md-5 col-sm-7" >
                                <div class="card-body">
                                    <a href="item-detail/?pk=${data[i].product_code}" class="title h5" "> ${data[i].name} </a>

                                    <div class="rating-wrap mb-2">
                                        <ul class="rating-stars">
                                            <li class="stars-active" style="width: 90%;">
                                                <img src="{% static 'new/store/images/misc/stars-active.svg' %}" alt="">
                                            </li>
                                            <li><img src="{% static 'new/store/images/misc/starts-disable.svg' %}" alt=""></li>
                                        </ul>
                                        <span class="label-rating text-warning">4.5</span>
                                        <i class="dot"></i>
                                        <span class="label-rating text-muted">154 orders</span>
                                    </div> <!-- rating-wrap.// -->
                                    <p> ${data[i].description || "Description not available."}</p>
                                </div> <!-- card-body.// -->
                            </div> <!-- col.// -->
                            <aside class="col-xl-3 col-md-3 col-sm-5">
                                <div class="info-aside">
                                    <div class="price-wrap">`
        if (data[i].get_discount_price < data[i].get_mrp) {
        text += `<span class="price h5"> ₹${data[i].get_discount_price} </span>
            <del class="price-old"> ₹${data[i].get_mrp} </del>`
        }
        else {
        text += `<span class="price h5"> ₹${data[i].min_mrp} </span>`
        }




                                    text += `</div> <!-- info-price-detail // -->
                                    <p class="text-success">Free shipping</p>
                                    <br>
                                    <div class="mb-3">
                                        <a href="#" class="btn btn-primary"> Buy this </a>
                                        <a href="#" class="btn btn-light btn-icon"> <i class="fa fa-heart"></i> </a>
                                    </div>
                                </div> <!-- info-aside.// -->
                            </aside> <!-- col.// -->
                        </div> <!-- row.// -->
                    </article>`;

    }
    return text;
}

function pagination_datable(category, curr_page, next) {
    //data-page-no attribute will pass value as a string, to convert it to number multiply by 1
    curr_page = curr_page*1
    let next_page = (curr_page) + 1, prev_page = (curr_page) - 1;
    let resp = ``;
            if (curr_page != 1 && next != null) {
                resp += `          
                         <nav class="ms-3">
                            <ul class="pagination">
                                <li class="page page-item">
                                    <a class="page-link pagination-select" type="button" data-page-no = "${prev_page}" data-categories = "${category}">${prev_page}</a>
                                </li>
                                <li class="page-item active" aria-current="page">
                                    <span class="page-link pagination-select" type="button" data-page-no = "${curr_page}" data-categories = "${category}" >${curr_page}</span>
                                </li>
                                <li class="page-item">
                                    <a class="page-link pagination-select" type="button" data-page-no = "${next_page}" data-categories = "${category}">${next_page}</a>
                                </li>
                                <li class="page-item">
                                    <a class="page-link pagination-select" type="button" data-page-no = "${next_page}" data-categories = "${category}"  >Next</a>
                                </li>
                            </ul>
                        </nav>
                    `
            } else if (curr_page == 1) {
                resp += `
                         <nav class="ms-3">
                            <ul class="pagination">
                                <li class="page-item active" aria-current="page">
                                    <span class="page-link pagination-select" type="button" data-page-no = "${curr_page}" data-categories = "${category}">${curr_page}</span>
                                </li>
                                <li class="page-item">
                                    <a class="page-link pagination-select" type="button" data-page-no = "${next_page}" data-categories = "${category}">${next_page}</a>
                                </li>
                                <li class="page-item" >
                                    <a class="page-link pagination-select"  type="button" data-page-no = "${next_page}" data-categories = "${category}">Next</a>
                                </li>
                            </ul>
                        </nav>
                    `
            } else {
                resp += `
                
                         <nav class="ms-3">
                            <ul class="pagination">
                                <li class="page-item">
                                    <a class="page-link pagination-select" type="button" data-page-no = "${prev_page}" data-categories = "${category}" >${prev_page}</a>
                                </li>
                                <li class="page-item active" aria-current="page">
                                    <span class="page-link pagination-select" type="button" data-page-no = "${curr_page}" data-categories = "${category}" >${curr_page}</span>
                                </li>
                                </li>
                            </ul>
                        </nav>
                    `
            }
            if (curr_page <= 1) {
                document.getElementById("pagination-goback").innerHTML = `<a class="pagination-select btn btn-light" type="button" data-page-no="${curr_page}" data-categories="${category}" > &laquo; Go back</a>`
            }
            else {
                document.getElementById("pagination-goback").innerHTML = `<a class="pagination-select btn btn-light" type="button" data-page-no="${prev_page}" data-categories="${category}" > &laquo; Go back</a>`
            }


            document.getElementById("pagination-temp").innerHTML = resp

}

function pagination(category, min_mrp, max_mrp, curr_page) {

    // let URL = '/api/store-products/pageSize=5&page=' + curr_page;
    //
    // if (category) URL += '&category__in=' + category

    $.ajax({

        url: '/api/store-products/?category__in=' + category + '&mrp=' + min_mrp + ',' + max_mrp  + '&pageSize=5&page=' + curr_page,

        type: "GET",

        dataType: "json", success: function (data) {

            $('#data-container').html(template(data));

            pagination_datable(category, curr_page, data['next']);
            $('html, body').animate({scrollTop: 0}, 0);
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}