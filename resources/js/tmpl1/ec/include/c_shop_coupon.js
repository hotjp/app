(function () {
    //绑定点击事件
    $("[data-type='coupon']").bind("click", function () {
        var batch = $(this).data("batch");
        //验证是否登录
        checkLogin(function(result){
            if (result.success == false) {
                location.href = result.url;
                return false;
            }
            //服务器传送数据
            loader();
            $.ajax({
                type: "POST",
                url: vars.root + "/ec/mbr/doAcquire.do",
                data: {
                    batch: batch
                },
                dataType: "json",
                success: function (data) {
                    removeloader();
                    if (data.success) {
                        mui.alert("优惠券领取成功");
                    } else {
                        mui.alert(data.errorMessage);
                    }
                }
            })
        });
    });
})();


function acquireCoupon(){

}