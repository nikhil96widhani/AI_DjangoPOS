// var data = JSON.parse("{{datas|escapejs}}");
// console.log(data);
// $(document).ready( function () {
//      $('#table_id').DataTable();
// } );
// // {#var dataNode = document.getElementById('alldata');#}
// // {#dataNode.innerHTML+="{{data|escapejs}}";#}
// // {#dataNode = document.getElementById('neatdata');#}
// // {#for(var x in data){#}
// // {#    dataNode.innerHTML+=x+' : '+data[x]+'<br><br>';#}
// console.log(typeof data);
// buildtable(data);
// var array = []
// $(document).on('submit', '#new_employee_form', function(e){
//     e.preventDefault();
//     {#alert($(this).attr("name").value);#}
//     {#console.log(document.getElementById("name").value)#}
//     $.ajax({
//
//        type:'POST',
//        url:'{% url "employee-new_ajax" %}',
//         {#$("#display")#}
//        data:{
//            name:$('#name').val(),
//            position:$('#position').val(),
//            phone_no:$('#phone_no').val(),
//            csrfmiddlewaretoken: $('input[name=csrfmiddlewaretoken]').val()
//        },
//         success:function (employees){
//             console.log(employees)
//             var trhtml='';
//
//            alert("New employee created");
//             buildtable(employees)
//         }
//     });
// });
// function buildtable(data) {
//     var table = document.getElementById("employee_display")
//     let trhtml='';
//     for (let i = 0; i < data.length; i++) {
//         {#console.log(data[i].name)#}
//         {#console.log(data[i].position)#}
//         {#console.log(data[i].phone_no)#}
//         var name = data[i].name
//         var position = data[i].position
//         var phone_no = data[i].phone_no
//         console.log(name, position, phone_no)
//         trhtml += `<tr>
//                             <td>${name}</td>
//                             <td>${position}</td>
//                             <td>${phone_no}</td>
//                        </tr>`
//         {#console.log(row1)#}
//         {#table.innerHTML += row1#}
//     }
//     console.log(trhtml)
//     {#table.innerHTML = trhtml#}
//     $('#employee_display').empty().append(trhtml);
// }

let curr_page = 1, cnt;
var dataContainer;
// function Url(e) {
//     var url = "{% url 'myapp:productdetail' %}";
//     e.href = url;
//     alert(e.dataset.id);
//     alert("hi");
// }
function template(data) {
    console.log("hI");
    let text = ``;
    // {% url 'store_items_detail' %}
    for (var i = 0; i < data.length; i++) {
        // text += `<article class="card card-product-list" >
        //                     <div class="row g-0">
        //                         <aside class="col-xl-3 col-md-4">
        //                             <a href="#" class="img-wrap"> <img src="images/items/9.jpg"> </a>
        //                         </aside> <!-- col.// -->
        //                         <div class="col-xl-6 col-md-5 col-sm-7">
        //                             <div class="card-body">
        //                                 <a href="#" class="title h5"> Rucksack Backpack Jeans </a>
        //
        //                                 <div class="rating-wrap mb-2">
        //                                     <ul class="rating-stars">
        //                                         <li class="stars-active" style="width: 90%;">
        //                                             <img src="{% static 'new/images/misc/stars-active.svg' %}" alt="">
        //                                         </li>
        //                                         <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
        //                                     </ul>
        //                                     <span class="label-rating text-warning">4.5</span>
        //                                     <i class="dot"></i>
        //                                     <span class="label-rating text-muted">154 orders</span>
        //                                 </div> <!-- rating-wrap.// -->
        //                                 <p> Short description about the product goes here, for ex its features. Lorem
        //                                     ipsum
        //                                     dolor sit amet with hapti you enter into any new area of science, you almost
        //                                     lorem ipsum is great text consectetur adipisicing</p>
        //                             </div> <!-- card-body.// -->
        //                         </div> <!-- col.// -->
        //                         <aside class="col-xl-3 col-md-3 col-sm-5">
        //                             <div class="info-aside">
        //                                 <div class="price-wrap">
        //                                     <span class="price h5"> $34.50 </span>
        //                                     <del class="price-old"> $198</del>
        //                                 </div> <!-- info-price-detail // -->
        //                                 <p class="text-success">Free shipping</p>
        //                                 <br>
        //                                 <div class="mb-3">
        //                                     <a href="#" class="btn btn-primary"> Buy this </a>
        //                                     <a href="#" class="btn btn-light btn-icon"> <i class="fa fa-heart"></i> </a>
        //                                 </div>
        //                             </div> <!-- info-aside.// -->
        //                         </aside> <!-- col.// -->
        //                     </div> <!-- row.// -->
        //                 </article>`
        text += `<article class="card card-product-list" >
                            <div class="row g-0" >
                            <aside class="col-xl-3 col-md-4">
                                <a href="item-detail/${data[i].product_code}" class="img-wrap" data-id = "${data[i].product_code}" onclick="Url(this)"> <img src="${data[i].get_image}"> </a>
                            </aside> <!-- col.// -->
                            <div class="col-xl-6 col-md-5 col-sm-7" >
                                <div class="card-body">
                                    <a href="item-detail/${data[i].product_code}" class="title h5" "> ${data[i].name} </a>

                                    <div class="rating-wrap mb-2">
                                        <ul class="rating-stars">
                                            <li class="stars-active" style="width: 90%;">
                                                <img src="{% static 'new/images/misc/stars-active.svg' %}" alt="">
                                            </li>
                                            <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
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
        text += `<span className="price h5"> ₹${data[i].get_discount_price} </span>
            <del className="price-old"> ₹${data[i].get_mrp} </del>`
        }
        else {
        text += `<span class="price h5"> ₹${data[i].get_mrp} </span>`
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


function pagination_temp(category, curr_page) {



    $.ajax({

        url: '/api/products-by-category/?categories=' + category + '&pageSize=5&page=' + curr_page,

        type: "GET",

        dataType: "json", success: function (data) {
            // cnt = data.count;
            $('#data-container').html(template(data['results']));
            let text = ``;
            console.log("sup bro")
            console.log(typeof category, category)
            console.log("sup bro")
            let max_pages = Math.ceil(data['count'] / 5);

            let resp = ``;
            if (curr_page != 1 && data['next'] != null) {
                console.log("hi1");
                resp += `                        
                         <nav class="ms-3">
                            <ul class="pagination">
                                <li class="page page page-item"><a class="page-link" onclick="pagination_temp(${category}, ${curr_page - 1})" data-page-no = "${curr_page - 1}">${curr_page - 1}</a></li>
                                <li class="page page-item active" aria-current="page">
                                    <span class="page-link">${curr_page}</span>
                                </li>
                                <li class="page page-item"><a class="page-link" onclick="pagination_temp(${category}, ${curr_page + 1})" data-page-no = "${curr_page + 1}">${curr_page + 1}</a></li>
                                <li class="page-item">
                                    <a class="page-link" onclick="pagination_temp(${category}, ${curr_page + 1})" id = "next" >Next</a>
                                </li>
                            </ul>
                        </nav>
                    `
            } else if (curr_page == 1) {
                console.log("hi2");
                resp += `
                         <nav class="ms-3">
                            <ul class="pagination">
                                <li class="page page-item active" aria-current="page" data-page-no = "${curr_page}">
                                    <span class="page-link">${curr_page}</span>
                                </li>
                                <li class="page page-item" data-page-no = "${curr_page + 1}">
                                    <a class="page-link" type="button" onclick="pagination_temp(${category}, ${curr_page + 1})">${curr_page + 1}</a>
                                </li>
                                <li class="page page-item" data-page-no = "${curr_page + 1}">
                                    <a class="page-link" onclick="pagination_temp(${category}, ${curr_page + 1})" id = "next">${category}</a>
                                </li>
                            </ul>
                        </nav>
                    `
            } else {
                // {% url 'store_items_detail' %}
                console.log("hi3");
                resp += `
                
                         <nav class="ms-3">
                            <ul class="pagination">
                                <li class="page page-item"><a class="page-link" onclick="pagination_temp(${category}, ${curr_page - 1})">${curr_page - 1}</a></li>
                                <li class="page page-item active" aria-current="page">
                                    <span class="page-link">${curr_page}</span>
                                </li>
                                </li>
                            </ul>
                        </nav>
                    `
            }
            // console.log({curr_page, cnt, max_pages});
            console.log(data);
            document.getElementById("pagination-temp").innerHTML = resp
            $('html, body').animate({scrollTop: 0}, 0);

             $.ajax({

                url: '/api/product-categories/',

                type: "GET",

                dataType: "json", success: function (data) {
                    // cnt = data.count;
                    let text = ``;
                    console.log("sup bro")
                    for (var i = 0; i < data['categories'].length; i++) {
                        text += `<label class="form-check mb-2">
                                                    <input class="form-check-input" name="category" type="checkbox" value="${data['categories'][i]}">
                                                    <span class="form-check-label"> ${data['categories'][i]} </span>
                                                    <b class="badge rounded-pill bg-gray-dark float-end">120</b>
                                                </label> <!-- form-check end.// -->`;
        // <article class="card card-product-list" >
        //                         <div class="row g-0" >
        //                         <aside class="col-xl-3 col-md-4">
        //                             <a href="#" class="img-wrap"> <img src="${data['results'][i].image}"> </a>
        //                         </aside> <!-- col.// -->
        //                         <div class="col-xl-6 col-md-5 col-sm-7" >
        //                             <div class="card-body">
        //                                 <a href="#" class="title h5"> ${data['results'][i].product.name} </a>
        //
        //                                 <div class="rating-wrap mb-2">
        //                                     <ul class="rating-stars">
        //                                         <li class="stars-active" style="width: 90%;">
        //                                             <img src="{% static 'new/images/misc/stars-active.svg' %}" alt="">
        //                                         </li>
        //                                         <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
        //                                     </ul>
        //                                     <span class="label-rating text-warning">4.5</span>
        //                                     <i class="dot"></i>
        //                                     <span class="label-rating text-muted">154 orders</span>
        //                                 </div> <!-- rating-wrap.// -->
        //                                 <p> ${data['results'][i].description}</p>
        //                             </div> <!-- card-body.// -->
        //                         </div> <!-- col.// -->
        //                         <aside class="col-xl-3 col-md-3 col-sm-5">
        //                             <div class="info-aside">
        //                                 <div class="price-wrap">
        //                                     <span class="price h5"> ₹${data['results'][i].cost} </span>
        //                                     <del class="price-old"> ₹${data['results'][i].mrp}</del>
        //                                 </div> <!-- info-price-detail // -->
        //                                 <p class="text-success">Free shipping</p>
        //                                 <br>
        //                                 <div class="mb-3">
        //                                     <a href="#" class="btn btn-primary"> Buy this </a>
        //                                     <a href="#" class="btn btn-light btn-icon"> <i class="fa fa-heart"></i> </a>
        //                                 </div>
        //                             </div> <!-- info-aside.// -->
        //                         </aside> <!-- col.// -->
        //                     </div> <!-- row.// -->
        //                 </article>`;

                    }
                    // text += `<button class="btn btn-light w-100" type="button" onclick="apply_category()">Apply</button>`
                    // text += `<input type="button" id="btn_" value="submit" />`;
                    document.getElementById("category-container").innerHTML = text;
                    // let categories;
                    // categories = new Array();
                    // $('input[name="category"]:checked').each(function() {
                    //     categories.push(this.value);
                    // });
                    // alert("Number of selected Languages: " + categories.length + "\n" + "And, they are: " + categories);
                // pagination();
                },

                error: function (error) {
                    console.log(`Error ${error}`);
                }

            });
            // $('.page').on('click', function () {
            //     // $('#item-list').empty()
            //     console.log("hi");
            //     console.log(this.getAttribute("data-page-no"));
            //     var next_page = this.getAttribute("data-page-no");
            //     ajaxCall(next_page);
            //
            // })
            // for (var i = 0; i < data['categories'].length; i++) {
            //
            //     text += `<label class="form-check mb-2">
            //                                 <input class="form-check-input" name="category" type="checkbox" value="${data['categories'][i]}">
            //                                 <span class="form-check-label"> ${data['categories'][i]} </span>
            //                                 <b class="badge rounded-pill bg-gray-dark float-end">120</b>
            //                             </label> <!-- form-check end.// -->`;
            //
            // }
            // document.getElementById("category-container").innerHTML = text;
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}


function pagination(category) {
    console.log("sup")
    console.log(category)
    $('#pagination-container').pagination({
        // dataSource: '/api/products',
        dataSource: '/api/products-by-category/?categories=' + category,
        // dataSource: '/api/?something=' + category,
        alias: {
            pageNumber: 'page',
        },
        locator: 'results',

        totalNumberLocator: function (response) {
            // you can return totalNumber by analyzing response content
            return response.count;
        },
        pageSize: 5,
        ajax: {
            beforeSend: function () {
                $('#data-container').html('Loading data ...');
            }
        },
        callback: function (data, pagination) {
            // template method of yourself
            console.log(pagination.pageNumber)
            console.log(data[0].product_code)
            $('html, body').animate({scrollTop: 0}, 0);
            $('#data-container').html(template(data));
        }
    });

    // $(".link1").click(function (e) {
    //     console.log("hdfasi;f");
    //     alert('Click Event Added!');
    // });
    list = document.querySelectorAll(".link1");
    for (var i = 0; i < list.length; i++) {
        list[i].addEventListener("click", function (e) {
            alert('Click Event Added!');
        });
    }
}


$(document).ready(function () {

    // ajaxCall(1);
    // pagination("default")

    pagination_temp("default", 1)

//     $.ajax({
//
//         url: '/api/product-categories/',
//
//         type: "GET",
//
//         dataType: "json", success: function (data) {
//             // cnt = data.count;
//             let text = ``;
//             console.log("sup bro")
//             for (var i = 0; i < data['categories'].length; i++) {
//                 text += `<label class="form-check mb-2">
//                                             <input class="form-check-input" name="category" type="checkbox" value="${data['categories'][i]}">
//                                             <span class="form-check-label"> ${data['categories'][i]} </span>
//                                             <b class="badge rounded-pill bg-gray-dark float-end">120</b>
//                                         </label> <!-- form-check end.// -->`;
// // <article class="card card-product-list" >
// //                         <div class="row g-0" >
// //                         <aside class="col-xl-3 col-md-4">
// //                             <a href="#" class="img-wrap"> <img src="${data['results'][i].image}"> </a>
// //                         </aside> <!-- col.// -->
// //                         <div class="col-xl-6 col-md-5 col-sm-7" >
// //                             <div class="card-body">
// //                                 <a href="#" class="title h5"> ${data['results'][i].product.name} </a>
// //
// //                                 <div class="rating-wrap mb-2">
// //                                     <ul class="rating-stars">
// //                                         <li class="stars-active" style="width: 90%;">
// //                                             <img src="{% static 'new/images/misc/stars-active.svg' %}" alt="">
// //                                         </li>
// //                                         <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
// //                                     </ul>
// //                                     <span class="label-rating text-warning">4.5</span>
// //                                     <i class="dot"></i>
// //                                     <span class="label-rating text-muted">154 orders</span>
// //                                 </div> <!-- rating-wrap.// -->
// //                                 <p> ${data['results'][i].description}</p>
// //                             </div> <!-- card-body.// -->
// //                         </div> <!-- col.// -->
// //                         <aside class="col-xl-3 col-md-3 col-sm-5">
// //                             <div class="info-aside">
// //                                 <div class="price-wrap">
// //                                     <span class="price h5"> ₹${data['results'][i].cost} </span>
// //                                     <del class="price-old"> ₹${data['results'][i].mrp}</del>
// //                                 </div> <!-- info-price-detail // -->
// //                                 <p class="text-success">Free shipping</p>
// //                                 <br>
// //                                 <div class="mb-3">
// //                                     <a href="#" class="btn btn-primary"> Buy this </a>
// //                                     <a href="#" class="btn btn-light btn-icon"> <i class="fa fa-heart"></i> </a>
// //                                 </div>
// //                             </div> <!-- info-aside.// -->
// //                         </aside> <!-- col.// -->
// //                     </div> <!-- row.// -->
// //                 </article>`;
//
//             }
//             // text += `<button class="btn btn-light w-100" type="button" onclick="apply_category()">Apply</button>`
//             // text += `<input type="button" id="btn_" value="submit" />`;
//             document.getElementById("category-container").innerHTML = text;
//             // let categories;
//             // categories = new Array();
//             // $('input[name="category"]:checked').each(function() {
//             //     categories.push(this.value);
//             // });
//             // alert("Number of selected Languages: " + categories.length + "\n" + "And, they are: " + categories);
//         // pagination();
//         },
//
//         error: function (error) {
//             console.log(`Error ${error}`);
//         }
//
//     });


 // dataSource: '/api/products-by-category/default',
    // dataContainer = document.getElementById("item-list");
    // $('#pagination-container').pagination({
    //     // dataSource: '/api/products',
    //     dataSource: '/api/products-by-category/default',
    //     alias: {
    //         pageNumber: 'page',
    //     },
    //     locator: 'results',
    //
    //     totalNumberLocator: function (response) {
    //         // you can return totalNumber by analyzing response content
    //         return response.count;
    //     },
    //     pageSize: 5,
    //     ajax: {
    //         beforeSend: function () {
    //             $('#data-container').html('Loading data ...');
    //         }
    //     },
    //     callback: function (data, pagination) {
    //         // template method of yourself
    //         console.log(pagination.pageNumber)
    //         console.log(data[0].product_code)
    //         $('html, body').animate({scrollTop: 0}, 0);
    //         $('#data-container').html(template(data));
    //     }
    // });
    //
    // // $(".link1").click(function (e) {
    // //     console.log("hdfasi;f");
    // //     alert('Click Event Added!');
    // // });
    // list = document.querySelectorAll(".link1");
    // for (var i = 0; i < list.length; i++) {
    //     list[i].addEventListener("click", function (e) {
    //         alert('Click Event Added!');
    //     });
    // }
});
function apply_category() {
    let checkbox_value = new Array();

    $("input:checkbox[name=category]:checked").each(function () {
        console.log($(this).val())
        checkbox_value.push($(this).val());
    });
    // $(":checkbox").each(function () {
    //     var ischecked = $(this).is(":checked");
    //     if (ischecked) {
    //         // checkbox_value += $(this).val() + "|";
    //         console.log($(this).val())
    //         console.log(ischecked)
    //         checkbox_value.push($(this).val());
    //         // console.log(checkbox_value)
    //         // if (checkbox_value == "") {
    //         //     checkbox_value = $(this).val()
    //         // }
    //
    //     }
    // });
    alert(checkbox_value)
    alert(checkbox_value.length);
    if (checkbox_value.length == 0) pagination("default")
    else pagination(checkbox_value)
}
// $("#btn_").on('click', function () {
//     console.log("not good")
//     var checkbox_value = 0;
//     $(":checkbox").each(function () {
//         var ischecked = $(this).is(":checked");
//         if (ischecked) {
//             // checkbox_value += $(this).val() + "|";
//             checkbox_value += 1
//         }
//     });
//     alert(checkbox_value);
// });
// function ajaxCall(page) {
//     $.ajax({
//
//         url: '/api/variations/?page=' + page,
//
//         type: "GET",
//
//         dataType: "json", success: function (data) {
//             cnt = data.count;
//             let text = ``;
//             for (var i = 0; i < data['results'].length; i++) {
//                 text += `<article class="card card-product-list" >
//                             <div class="row g-0" >
//                             <aside class="col-xl-3 col-md-4">
//                                 <a href="#" class="img-wrap"> <img src="${data['results'][i].image}"> </a>
//                             </aside> <!-- col.// -->
//                             <div class="col-xl-6 col-md-5 col-sm-7" >
//                                 <div class="card-body">
//                                     <a href="#" class="title h5"> ${data['results'][i].product.name} </a>
//
//                                     <div class="rating-wrap mb-2">
//                                         <ul class="rating-stars">
//                                             <li class="stars-active" style="width: 90%;">
//                                                 <img src="{% static 'new/images/misc/stars-active.svg' %}" alt="">
//                                             </li>
//                                             <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
//                                         </ul>
//                                         <span class="label-rating text-warning">4.5</span>
//                                         <i class="dot"></i>
//                                         <span class="label-rating text-muted">154 orders</span>
//                                     </div> <!-- rating-wrap.// -->
//                                     <p> ${data['results'][i].description}</p>
//                                 </div> <!-- card-body.// -->
//                             </div> <!-- col.// -->
//                             <aside class="col-xl-3 col-md-3 col-sm-5">
//                                 <div class="info-aside">
//                                     <div class="price-wrap">
//                                         <span class="price h5"> ₹${data['results'][i].cost} </span>
//                                         <del class="price-old"> ₹${data['results'][i].mrp}</del>
//                                     </div> <!-- info-price-detail // -->
//                                     <p class="text-success">Free shipping</p>
//                                     <br>
//                                     <div class="mb-3">
//                                         <a href="#" class="btn btn-primary"> Buy this </a>
//                                         <a href="#" class="btn btn-light btn-icon"> <i class="fa fa-heart"></i> </a>
//                                     </div>
//                                 </div> <!-- info-aside.// -->
//                             </aside> <!-- col.// -->
//                         </div> <!-- row.// -->
//                     </article>`;
//
//             }
//             document.getElementById("item-list").innerHTML = text;
//             pagination();
//         },
//
//         error: function (error) {
//             console.log(`Error ${error}`);
//         }
//
//     });
// }

// <footer className="d-flex mt-4">
//     <div>
//         <a href="javascript: history.back()" className="btn btn-light"> &laquo; Go back</a>
//     </div>
//     <nav className="ms-3">
//         <ul className="pagination">
//             <li className="page-item"><a className="page-link" href="#">1</a></li>
//             <li className="page-item active" aria-current="page">
//                 <span className="page-link">2</span>
//             </li>
//             <li className="page-item"><a className="page-link" href="#">3</a></li>
//             <li className="page-item">
//                 <a className="page-link" href="#">Next</a>
//             </li>
//         </ul>
//     </nav>
// </footer>

// function pagination() {
//     let max_pages = Math.ceil(cnt / 5);
//
//     let resp = ``;
//     resp += `
//              <footer class="d-flex mt-4">
//             `
//     if (curr_page != 1 && curr_page != max_pages) {
//         console.log("hi1");
//         resp += `
//                  <div>
//                     <a href="#" class="page btn btn-light" id = "prev" data-page-no = "${curr_page}"> &laquo; Go back</a>
//                  </div>
//                  <nav class="ms-3">
//                     <ul class="pagination">
//                         <li class="page page page-item"><a class="page-link" href="#">${curr_page - 1}</a></li>
//                         <li class="page page-item active" aria-current="page">
//                             <span class="page-link">${curr_page}</span>
//                         </li>
//                         <li class="page page-item"><a class="page-link" href="#">${curr_page + 1}</a></li>
//                         <li class="page-item">
//                             <a class="page-link" href="#" id = "next">Next</a>
//                         </li>
//                     </ul>
//                 </nav>
//             `
//     } else if (curr_page == 1) {
//         console.log("hi2");
//         resp += `
//                  <nav class="ms-3">
//                     <ul class="pagination">
//                         <li class="page page-item active" aria-current="page" data-page-no = "${curr_page}">
//                             <span class="page-link">${curr_page}</span>
//                         </li>
//                         <li class="page page-item" data-page-no = "${curr_page + 1}"><a class="page-link" href="#">${curr_page + 1}</a></li>
//                         <li class="page page-item" data-page-no = "${curr_page + 1}">
//                             <a class="page-link" href="#" id = "next">Next</a>
//                         </li>
//                     </ul>
//                 </nav>
//             `
//     } else {
//         // {% url 'store_items_detail' %}
//         console.log("hi3");
//         resp += `
//                  <div>
//                     <a href="#" class="page btn btn-light" id = "prev"> &laquo; Go back</a>
//                  </div>
//                  <nav class="ms-3">
//                     <ul class="pagination">
//                         <li class="page page-item"><a class="page-link" href="#">${curr_page - 1}</a></li>
//                         <li class="page page-item active" aria-current="page">
//                             <span class="page-link">${curr_page}</span>
//                         </li>
//                         </li>
//                     </ul>
//                 </nav>
//             `
//     }
//     resp += `</footer>`;
//     console.log({curr_page, cnt, max_pages});
//     console.log(resp);
//     document.getElementById("pagination").innerHTML = resp
//     $('.page').on('click', function () {
//         $('#item-list').empty()
//         console.log("hi");
//         console.log(this.getAttribute("data-page-no"));
//         var cur_page = this.getAttribute("data-page-no");
//         ajaxCall(cur_page);
//
//     })
//
// }

// var loading = false;
// var page = 1;
// $(window).bind('scroll', function () {
//     // if(!loading && $(window).scrollTop() >= ($('#item-list').offset().top + $('#item-list').outerHeight() - window.innerHeight)) {
//     if ($(window).scrollTop() + window.innerHeight == $(document).height()) {
//
//         loading = true;
//
//         // $('div#loadmoreajaxloader').show();
//         $.ajax({
//             url: '/api/variations/?page=' + page,
//             method: "get",
//             type: "GET",
//
//             dataType: "json", success: function (data) {
//                 console.log(data['results'][0].image);
//
//
//                 let text = ``;
//                 for (var i = 0; i < data['results'].length; i++) {
//                     text += `<article class="card card-product-list" >
//                             <div class="row g-0" >
//                             <aside class="col-xl-3 col-md-4">
//                                 <a href="#" class="img-wrap"> <img src="${data['results'][i].image}"> </a>
//                             </aside> <!-- col.// -->
//                             <div class="col-xl-6 col-md-5 col-sm-7" >
//                                 <div class="card-body">
//                                     <a href="#" class="title h5"> ${data['results'][i].product.name} </a>
//
//                                     <div class="rating-wrap mb-2">
//                                         <ul class="rating-stars">
//                                             <li class="stars-active" style="width: 90%;">
//                                                 <img src="{% static 'new/images/misc/stars-active.svg' %}" alt="">
//                                             </li>
//                                             <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
//                                         </ul>
//                                         <span class="label-rating text-warning">4.5</span>
//                                         <i class="dot"></i>
//                                         <span class="label-rating text-muted">154 orders</span>
//                                     </div> <!-- rating-wrap.// -->
//                                     <p> ${data['results'][i].description}</p>
//                                 </div> <!-- card-body.// -->
//                             </div> <!-- col.// -->
//                             <aside class="col-xl-3 col-md-3 col-sm-5">
//                                 <div class="info-aside">
//                                     <div class="price-wrap">
//                                         <span class="price h5"> ₹${data['results'][i].cost} </span>
//                                         <del class="price-old"> ₹${data['results'][i].mrp}</del>
//                                     </div> <!-- info-price-detail // -->
//                                     <p class="text-success">Free shipping</p>
//                                     <br>
//                                     <div class="mb-3">
//                                         <a href="#" class="btn btn-primary"> Buy this </a>
//                                         <a href="#" class="btn btn-light btn-icon"> <i class="fa fa-heart"></i> </a>
//                                     </div>
//                                 </div> <!-- info-aside.// -->
//                             </aside> <!-- col.// -->
//                         </div> <!-- row.// -->
//                     </article>`;
//                 }
//                 page += 1;
//                 document.getElementById("item-list").innerHTML = text
//             },
//
//             error: function (error) {
//                 console.log(`Error ${error}`);
//             }
//         }); // close AJAX
//     }  // close if()
// });