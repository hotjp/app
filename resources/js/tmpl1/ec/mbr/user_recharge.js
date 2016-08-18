$(function () {


    $("#recharge").click(function () {//确认订单

            confirmOrder();

    });


});


/**
 * 确认订单
 */
function confirmOrder() {

    var data_confirm = {
        rechargeId: 1
    };


    $.postForm(vars.root + "/ec/mbr/recharge_pay.html", data_confirm);
}


