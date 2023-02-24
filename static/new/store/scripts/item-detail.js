function datatable(data, ind) {

    let product_data = data.product_data
    let variation_data = data['variation_data'][ind]
    console.log(product_data)
    console.log(variation_data)
    let text = `
        <div class="container">

            <div class="row">
                <aside class="col-lg-6">
                    <article class="gallery-wrap">
                        <div class="img-big-wrap img-thumbnail">

                            <a data-fslightbox="mygalley" data-type="image" href=" ${variation_data.image} ">
                                <img height="560" src="${variation_data.image}">
                            </a>
                        </div> <!-- img-big-wrap.// -->
                        <div class="thumbs-wrap">
                            {#                            variation images#}
                            <a data-fslightbox="mygalley" data-type="image"
                               href="{% static 'new/images/items/detail1/big1.jpg' %}"
                               class="item-thumb">

                                <img width="60" height="60" src="{% static 'new/images/items/detail1/thumb1.jpg' %}">
                            </a>

                            <a data-fslightbox="mygalley" data-type="image"
                               href="{% static 'new/images/items/detail1/big2.jpg' %}"
                               class="item-thumb">

                                <img width="60" height="60" src="{% static 'new/images/items/detail1/thumb2.jpg' %}">
                            </a>

                            <a data-fslightbox="mygalley" data-type="image"
                               href="{% static 'new/images/items/detail1/big3.jpg' %}"
                               class="item-thumb">

                                <img width="60" height="60" src="{% static 'new/images/items/detail1/thumb3.jpg' %}">
                            </a>

                            <a data-fslightbox="mygalley" data-type="image"
                               href="{% static 'new/images/items/detail1/big4.jpg' %}"
                               class="item-thumb">

                                <img width="60" height="60" src="{% static 'new/images/items/detail1/thumb4.jpg' %}">
                            </a>

                            <a data-fslightbox="mygalley" data-type="image"
                               href="{% static 'new/images/items/detail1/big.jpg' %}"
                               class="item-thumb">

                                <img width="60" height="60" src="{% static 'new/images/items/detail1/thumb.jpg' %}">
                            </a>
                        </div> <!-- thumbs-wrap.// -->
                    </article> <!-- gallery-wrap .end// -->
                </aside>
                <main class="col-lg-6">
                    <article class="ps-lg-3">
                        <h4 class="title text-dark">  ${product_data.name}<br>     
                        <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenu2" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
            ${variation_data.variation_name}
        </button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">`

    for (let i = 0; i < data.variation_data.length; i++) {
        text += `<button class="variation-select dropdown-item" type="button"
                data-id="${i}" onclick="product_data_with_variation(${product_data.product_code}, ${i})">${data.variation_data[i].variation_name}</button>`
    }
    text += `</div>
</div>
</h4>
                        <div class="rating-wrap my-3">
                            <ul class="rating-stars">

                                <li style="width:80%" class="stars-active"><img
                                        src="{% static 'new/images/misc/stars-active.svg' %}"
                                        alt=""></li>

                                <li><img src="{% static 'new/images/misc/starts-disable.svg' %}" alt=""></li>
                            </ul>
                            <b class="label-rating text-warning"> 4.5</b>
                            <i class="dot"></i>
                            <span class="label-rating text-muted"> <i
                                    class="fa fa-shopping-basket"></i> 154 orders </span>
                            <i class="dot"></i>
                            <span class="label-rating text-success">In stock</span>
                        </div> <!-- rating-wrap.// -->

                        <div class="mb-3">
                            <var class="price h5"> ${variation_data.mrp}</var>
                            <span class="text-muted">/per box</span>
                        </div>

                        <p>${product_data.description}</p>

                        <dl class="row">
                            <dt class="col-3">Type:</dt>
                            <dd class="col-9">Regular</dd>

                            <dt class="col-3">Color</dt>
                            <dd class="col-9">Brown</dd>

                            <dt class="col-3">Material</dt>
                            <dd class="col-9">Cotton, Jeans</dd>

                            <dt class="col-3">Brand</dt>
                            <dd class="col-9">Reebook</dd>
                        </dl>

                        <hr>

                        <div class="row mb-4">
                            <div class="col-md-4 col-6 mb-2">
                                <label class="form-label">Size</label>
                                <select class="form-select">
                                    <option>Small</option>
                                    <option>Medium</option>
                                    <option>Large</option>
                                </select>
                            </div> <!-- col.// -->
                            <div class="col-md-4 col-6 mb-3">
                                <label class="form-label d-block">Quantity</label>
                                <div class="input-group input-spinner">
                                    <button class="btn btn-icon btn-light" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#999"
                                             viewBox="0 0 24 24">
                                            <path d="M19 13H5v-2h14v2z"></path>
                                        </svg>
                                    </button>
                                    <input class="form-control text-center" placeholder="" value="14">
                                    <button class="btn btn-icon btn-light" type="button">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#999"
                                             viewBox="0 0 24 24">
                                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                                        </svg>
                                    </button>
                                </div> <!-- input-group.// -->
                            </div> <!-- col.// -->
                        </div> <!-- row.// -->

                        <a href="#" class="btn  btn-warning"> Buy now </a>
                        <a href="#" class="btn  btn-primary"> <i class="me-1 fa fa-shopping-basket"></i> Add to cart
                        </a>
                        <a href="#" class="btn  btn-light"> <i class="me-1 fa fa-heart"></i> Save </a>

                    </article> <!-- product-info-aside .// -->
                </main> <!-- col.// -->
            </div> <!-- row.// -->

        </div> <!-- container .//  -->
        `;
    document.getElementById("product").innerHTML = text;

}


$(document).ready(function () {
    let product_id = $("#product").data("id");
    product_data_with_variation(product_id, 0);
    $(".variation-select").click(function () {

        let index = $(this).attr('data-id');
        console.log(index);
        datatable(index);
    });
});

function product_data_with_variation(product_code, ind) {
    $.ajax({

        url: '/api/product-and-variations/?action=product_variation_data&product_code=' + product_code,

        type: "GET",

        dataType: "json", success: function (resp) {
            console.log(resp)
            datatable(resp, ind)
            // return data;
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}
