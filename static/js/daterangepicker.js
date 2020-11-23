$(function() {

    // var start = moment().subtract(29, 'days');
    var start = moment();
    var end = moment();

    function cb(start, end) {
        $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
        console.log("date is" , start.format('Y-M-D'), end.format('Y-M-D'));
        UpdateStats(start.format('Y-M-D'), end.format('Y-M-D'))
    }

    $('#reportrange').daterangepicker({
        startDate: start,
        endDate: end,
        ranges: {
           'Today': [moment(), moment()],
           'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
           'Last 7 Days': [moment().subtract(6, 'days'), moment()],
           'Last 30 Days': [moment().subtract(29, 'days'), moment()],
           'This Month': [moment().startOf('month'), moment().endOf('month')],
           'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
        }
    }, cb);

    cb(start, end);

});

function UpdateStats(date1, date2) {
    let url = '/api/orders';

    $.getJSON(url, {'all_orders': 'False', 'date1': date1, 'date2': date2}, function (response) {
        UpdateStatsCards(response)

    }).fail(function () {
        toastr.error('Unable to fetch data! Please check date range selected or try again.');
    });

}

function UpdateStatsCards (response){
    document.getElementById("sold_order_number").innerHTML = response.orders.length +
            "                  <small class=\"text-success ml-2\">" +
            "                    <i class=\"fas fa-arrow-up fa-sm pr-1\"></i>13,4%</small>";


        document.getElementById("sold_item_number").innerHTML = response.orders_summary.total_items +
            "                  <small class=\"text-success ml-2\">" +
            "                    <i class=\"fas fa-arrow-up fa-sm pr-1\"></i>13,4%</small>";
1
        document.getElementById("sold_item_amount").innerHTML = response.orders_summary.total_amount +
            "                  <small class=\"text-success ml-2\">" +
            "                    <i class=\"fas fa-arrow-up fa-sm pr-1\"></i>13,4%</small>";

        document.getElementById("sold_item_revenue").innerHTML = response.orders_summary.total_revenue +
            "                  <small class=\"text-danger ml-2\">" +
            "                    <i class=\"fas fa-arrow-down fa-sm pr-1\"></i>13,4%</small>";

        // console.log(response)
}