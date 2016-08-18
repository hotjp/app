$(function(){
    mui('body').on('tap',".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    mui('body').on('tap',".mui-pull-right", function () {//返回用户中心
        toUserPage();
    });
    /*mui('body').on('tap', 'a', function (e) {
        var href = $(this).attr("href");
        toNewPage(href);
    });*/
    $("body").on("click", ".kuaidi", function () {
        $(this).parents(".shop-order").find(".select-balance").fadeIn(200)
    });
})

$(function () {

    $("#recharge").click(function () {//确认订单

        confirmOrder();

    });

});


/**
 * 确认订单
 */
function confirmOrder() {

    var rechargeId = $("#rechargeId").val();
    var otherFee = $("#otherFee").val();
    if((!rechargeId||rechargeId=="")&&(!otherFee)){
        mui.alert("请确定要充值金额");
        return;
    }
    if(!!otherFee&&otherFee<=0){
        mui.alert("充值金额需大于0");
        return;
    }

    var data_confirm = {
        //key: key,
        rechargeId:rechargeId,
        otherFee:otherFee
    };

    $.postForm(vars.root + "/ec/mbr/recharge_pay.html", data_confirm);
}



