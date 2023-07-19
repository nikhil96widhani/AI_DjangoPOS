const heartBtn = document.getElementById('heartBtn');

if (heartBtn) {
    heartBtn.addEventListener('click', function() {
  if (heartBtn.classList.contains('clicked')) {
    heartBtn.classList.remove('clicked');
  } else {
    heartBtn.classList.add('clicked');
  }
});
}

$(document).ready(function () {
    wishlist()
});

function template(data) {
    text = ``
    for (let i = 0; i < data.length; i++) {
        text += `<article class="row gy-3 mb-4">
        <div class="col-lg-5">
            <figure class="itemside me-lg-5">
                <div class="aside"><img src="${data[i].image}" class="img-md img-thumbnail"></div>
                <figcaption class="info">
                    <a href="../item-detail/?pk=${data[i].product.product_code}" class="title">${data[i].product.name}</a>
                    <p class="text-muted"> ${data[i].colour}, ${data[i].variation_name} </p>
                </figcaption>
            </figure>
        </div>
<!--        <div class="col-auto">-->
<!--            <select style="width: 100px" class="form-select">-->
<!--                <option>1</option>-->
<!--                <option>2</option>-->
<!--                <option>3</option>-->
<!--                <option>4</option>-->
<!--            </select>-->
<!--        </div>-->
        <div class="col-lg-2 col-sm-4 col-6">
            <div class="price-wrap lh-sm">
                <var class="price h6">₹${data[i].mrp}</var> <br>
<!--                <small class="text-muted"> $460.00 / per item </small>-->
            </div>
            <!-- price-wrap .// -->
        </div>
        <div class="col-lg col-sm-4">
            <div class="float-lg-end">
<!--                <a href="#" class="btn btn-light" id="heartBtn"> <i class="fa fa-heart"></i></a>-->
                <a class="btn btn-light text-danger WishListRemove" data-id="${data[i].id}"> Remove</a>
            </div>
        </div>
    </article> <!-- row.// -->`
    }
    return text;
}
$(document).on('click', '.WishListRemove', function() {
    remove($(this).data("id"))
});
async function remove(id) {

    fetch('/api/user-wishlist/?id='+ id + '&type=delete')
        .then(result =>{
            if (!result.ok) {
                console.log("problem")
                return
            }
            return result.json()
        })
        .then(data =>{
            if (data['status'] === "success") {
                wishlist()
                wishlist_count();
            }

        })
        .catch(error => {
            console.log(error)
        })
}

function wishlist() {


    $.ajax({

        url: '/api/user-wishlist/',

        type: "GET",

        dataType: "json", success: function (data) {
            $('#wishlist-container').html(template(data));
        },

        error: function (error) {
            console.log(`Error ${error}`);
        }

    });
}