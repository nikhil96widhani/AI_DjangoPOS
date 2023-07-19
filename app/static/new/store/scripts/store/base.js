$(document).ready(function () {
    wishlist_count()
    // let footer_height = document.getElementById("footer").offsetHeight;
    // let h1 = footer_height + "px"
    // let h2 = -1*footer_height + "px"
    // document.getElementById("main").style.paddingBottom = h1;
    // document.getElementById("footer").style.marginTop = h2;

});


async function wishlist_count() {
    fetch('/api/wishlist-count')
        .then(result =>{
            if (!result.ok) {
                console.log("problem")
                return
            }
            return result.json()
        })
        .then(data =>{
            $('#wishlist-count').text(data);

        })
        .catch(error => {
            console.log(error)
        })

}