function  datatable(data, ind, quantity) {

    let product_data = data.product_data
    let variation_data = data['variation_data'][ind]
    let text = `
        
        <div class="container">
    
            <div class="row">
            <aside class="col-lg-6">
              <article class="gallery-wrap"> 
                <div class="img-big-wrap img-thumbnail">
                   <a data-fslightbox="mygalley" data-type="image" href="${variation_data.image}"> 
                      <img height="560" src="${variation_data.image}"> 
                   </a>
                </div> <!-- img-big-wrap.// -->
                <div class="thumbs-wrap">
<!--                  <a data-fslightbox="mygalley" data-type="image" href="images/items/detail1/big1.jpg" class="item-thumb"> -->
<!--                    <img width="60" height="60" src="images/items/detail1/thumb1.jpg"> -->
<!--                  </a>-->
<!--                  <a data-fslightbox="mygalley" data-type="image" href="images/items/detail1/big2.jpg" class="item-thumb"> -->
<!--                    <img width="60" height="60" src="images/items/detail1/thumb2.jpg">  -->
<!--                  </a>-->
<!--                  <a data-fslightbox="mygalley" data-type="image" href="images/items/detail1/big3.jpg" class="item-thumb"> -->
<!--                    <img width="60" height="60" src="images/items/detail1/thumb3.jpg">  -->
<!--                  </a>-->
<!--                  <a data-fslightbox="mygalley" data-type="image" href="images/items/detail1/big4.jpg" class="item-thumb"> -->
<!--                    <img width="60" height="60" src="images/items/detail1/thumb4.jpg">  -->
<!--                  </a>-->
<!--                  <a data-fslightbox="mygalley" data-type="image" href="images/items/detail1/big.jpg" class="item-thumb"> -->
<!--                    <img width="60" height="60" src="images/items/detail1/thumb.jpg">  -->
<!--                  </a>-->
                </div> <!-- thumbs-wrap.// -->
              </article> <!-- gallery-wrap .end// -->
            </aside>
            <main class="col-lg-6">
              <article class="ps-lg-3">
                <h4 class="title text-dark"> ${product_data.name}</h4>
                <div class="rating-wrap my-3">
                  <ul class="rating-stars">
                    <li style="width:80%" class="stars-active"> <img src="images/misc/stars-active.svg" alt=""> </li>
                    <li> <img src="images/misc/starts-disable.svg" alt=""> </li>
                  </ul>
                  <b class="label-rating text-warning"> 4.5</b>
                  <i class="dot"></i>
                  <span class="label-rating text-muted"> <i class="fa fa-shopping-basket"></i> 154 orders </span>
                  <i class="dot"></i>
                  <span class="label-rating text-success">In stock</span>
                </div> <!-- rating-wrap.// -->
            
                <div class="mb-3"> 
                  <var class="price h5"> ${variation_data.mrp}</var> 
                  <span class="text-muted">/per box</span> 
                </div> 
            
                <p>${product_data.description}</p>
            
                <dl class="row">
                    <dt class="col-3">Brand</dt>
                    <dd class="col-9">${product_data.brand}</dd>
                    
                    <dt class="col-3">Category</dt>
                    <dd class="col-9">${product_data.category}</dd>
`
                if (variation_data.colour) {
                    text += `<dt class="col-3">Colour</dt>
                            <dd class="col-9">${variation_data.colour}</dd>`
                }
                  // text += `<dt class="col-3">Type:</dt>
                  // <dd class="col-9">Regular</dd>
                  //
                  // <dt class="col-3">Color</dt>
                  // <dd class="col-9">Brown</dd>
                  //
                  // <dt class="col-3">Material</dt>
                  // <dd class="col-9">Cotton, Jeans </dd>
                  //
                  // <dt class="col-3">Brand</dt>
                  // <dd class="col-9">Reebook </dd>
                text += `</dl>
            
                <hr>
            
                <div class="row mb-4">
                  <div class="col-md-4 col-6 mb-2">
                    <label class="form-label">Variation</label>
                    <select class="form-select value-input">`
                                for (let i = 0; i < data.variation_data.length; i++) {
                                    if (i == ind) {
                                                text += `<option selected data-ind="${i}" data-product-id="${product_data.product_code}">${data.variation_data[i].variation_name}</option>`

                                    }
                                    else {
                                                text += `<option data-ind="${i}" data-product-id="${product_data.product_code}">${data.variation_data[i].variation_name}</option>`

                                    }
                                }
                                text +=  ` 
              
                    </select>
                  </div> <!-- col.// -->
                  <div class="col-md-4 col-6 mb-3 quantity">
                    <label class="form-label d-block">Quantity</label>
                    <div class="input-group input-spinner">
                      <button class="btn btn-icon btn-light quantity-minus" type="button"> 
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#999" viewBox="0 0 24 24">
                            <path d="M19 13H5v-2h14v2z"></path>
                          </svg>
                      </button>
                      <input class="form-control text-center value-input" placeholder="" value="${quantity}" id="quantity">
                      <button class="btn btn-icon btn-light quantity-plus" type="button"> 
                          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#999" viewBox="0 0 24 24">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
                          </svg>
                      </button>
                    </div> <!-- input-group.// -->
                  </div> <!-- col.// -->
                </div> <!-- row.// -->
                <div  id="qrcode-container" style="position: relative; display: inline-block;">
                    <div id="qrcode"></div>
                    <span id="scan-text" style="position: absolute;
    top: 50%;
    right: -150px; /* Adjust this value to change the distance between the text and the QR code */
    transform: translateY(-50%);
    font-size: 16px;
    font-weight: bold;
    color: #555;
}">Scan to order</span>
                </div>
                <div style="width: 50%; height: 15px; border-bottom: 1px solid black; text-align: center">
                  <span style="font-size: 20px; background-color: #F3F5F6; padding: 0 10px;">
                    OR <!--Padding is optional-->
                  </span>
                </div>
<!--                <div class="row mb-4">-->
<!--                    <div class="col-md-4 col-4 mb-2" id="qrcode">-->
<!--                    </div>-->
<!--                    <div class="col-md-4 col-4 mb-1" >-->
<!--                    <h3> Scan to order.</h3>-->
<!--                    </div>-->
<!--                    <div style="width: 50%; height: 15px; border-bottom: 1px solid black; text-align: center">-->
<!--                  <span style="font-size: 20px; background-color: #F3F5F6; padding: 0 10px;">-->
<!--                    OR &lt;!&ndash;Padding is optional&ndash;&gt;-->
<!--                  </span>-->
<!--                </div>-->
<!--                </div>-->
                <br>
                <a href="https://wa.me/917987441085?text=Hi, I would like to order ${document.URL + encodeURIComponent("&index="+ind+"&quantity="+quantity)}" target="_blank" rel="noopener noreferrer" class="btn  btn-warning" id="buy"> Click to Buy  </a>
<!--                <a href="#" class="btn  btn-primary"> <i class="me-1 fa fa-shopping-basket"></i> Add to cart </a>-->
                <a href="../whislist/?type=add&id=${variation_data.id}" class="btn  btn-light "> <i class="me-1 fa fa-heart"></i> Add to wishlist </a>
              
              </article> <!-- product-info-aside .// -->
            </main> <!-- col.// -->
            </div> <!-- row.// -->
        
        </div> <!-- container .//  -->
        `;
                 //                text += `<a aria-label="Order on WhatsApp" href="https://wa.me/917987441085?text=Hi, I want to order ${document.URL}?index=${ind}" target="_blank" rel="noopener noreferrer">
                 // <img alt="Order on WhatsApp" src="/static/images/img_1.png" width="300" height="100"/>`
    document.getElementById("product").innerHTML = text;
    // var tmp = document.URL
    // console.log(tmp, typeof tmp)
    // tmp = tmp + "&index=" + ind
    // console.log(tmp, typeof tmp)
    // console.log(encodeURIComponent(tmp))
    var product_url = document.URL + encodeURIComponent("&index="+ind+"&quantity="+quantity)
    var url = "https://wa.me/917987441085?text=Hi, I would like to order \n" + product_url;
    new QRCode(document.getElementById("qrcode"), {
        text: url,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

$(document).ready(function () {
    let wishlist_url = $("#wishlist_url").data("id")
    console.log(wishlist_url)
    let product_id = $("#product").data("id");
    let index = $("#product").data("index");
    let quantity = $("#product").data("quantity");
    product_data_with_variation(product_id, index, quantity);

});


function incrementQuantity(e) {
    $('#quantity').val( function(i, oldval) {
        return ++oldval;
    });
}

function decrementQuantity(e) {
    $('#quantity').val( function(i, oldval) {
        if (oldval > 1) return --oldval;
        else return 1;
    });

}

function qrcode_generator() {
    let index = $('.value-input').find(':selected').attr('data-ind');
    let quantity = $('#quantity').val();
    let product_url = document.URL + encodeURIComponent("&index="+index+"&quantity="+quantity)
    let url = "https://wa.me/917987441085?text=Hi, I would like to order \n" + product_url;
    $("#qrcode").empty();
    $("#buy").attr("href", url);
    new QRCode(document.getElementById("qrcode"), {
        text: url,
        width: 128,
        height: 128,
        colorDark : "#000000",
        colorLight : "#ffffff",
        correctLevel : QRCode.CorrectLevel.H
    });
}

$(document).on('click', '.quantity-plus', function() {
  incrementQuantity();
  qrcode_generator();
});


$(document).on('click', '.quantity-minus', function() {
  decrementQuantity();
  qrcode_generator();
});

$(document).on('change', '#quantity', function() {
  qrcode_generator();
});

$(document).on('change',".value-input", function() {

        let index = $(this).find(':selected').attr('data-ind');
        let product_code = $(this).find(':selected').attr('data-product-id');
        let quantity = $('#quantity').val();
        product_data_with_variation(product_code, index, quantity)
});


function product_data_with_variation(product_code, ind, quantity) {
    $.ajax({

        url: '/api/product-and-variations/?action=product_variation_data&product_code=' + product_code,

        type: "GET",

        dataType: "json", success: function (resp) {
            datatable(resp, ind, quantity)
            // return data;
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}
