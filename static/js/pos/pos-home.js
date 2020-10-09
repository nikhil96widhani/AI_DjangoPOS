$(document).ready(function () {
    $("#AllProductList").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#AllProductListLi li").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    $('.stepper').mdbStepper();
});

function someFunction21() {
setTimeout(function () {
$('#horizontal-stepper').nextStep();
}, 2000);
}

// Refund Calculator
function CalculateRefund(cash, total) {
    if (cash<total){
        document.getElementById('RefundAmount').innerHTML = "Less Cash Recieved";
    }
    else if (cash>total){
        document.getElementById('RefundAmount').innerHTML = "Refund: " + (cash - total).toString();
    }
    else {
        document.getElementById('RefundAmount').innerHTML = "No items to calculate or unknown error";
    }

  }

