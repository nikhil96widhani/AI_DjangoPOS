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