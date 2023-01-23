function ajaxCall(curr_page) {
    $.ajax({

        url: '/api/variations/?page=' + curr_page,

        type: "GET",

        dataType: "json", success: function (data) {
            cnt = data.count;
            let text = ``;
            for (var i = 0; i < data['results'].length; i++) {
                text += `<article class="card card-product-list" >
                            <div class="row g-0" >
                            <aside class="col-xl-3 col-md-4">
                                <a href="#" class="img-wrap"> <img src="${data['results'][i].image}"> </a>
                            </aside> <!-- col.// -->
                            <div class="col-xl-6 col-md-5 col-sm-7" >
                                <div class="card-body">
                                    <a href="#" class="title h5"> ${data['results'][i].product.name} </a>

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
                                    <p> ${data['results'][i].description}</p>
                                </div> <!-- card-body.// -->
                            </div> <!-- col.// -->
                            <aside class="col-xl-3 col-md-3 col-sm-5">
                                <div class="info-aside">
                                    <div class="price-wrap">
                                        <span class="price h5"> ₹${data['results'][i].cost} </span>
                                        <del class="price-old"> ₹${data['results'][i].mrp}</del>
                                    </div> <!-- info-price-detail // -->
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
            document.getElementById("item-list").innerHTML = text;
            pagination();
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}