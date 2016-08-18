/*
$(function () {
    $(".mui-pull-left").click(function () {//返回按钮
        toIndexPage();
    });
    $("#sub-orders").click(function () {//提交订单
        var orderNoStr = $("#orderNoStr").val();
        var totalPrice = $("#total-price").val();
        var payType = $(".mui-selected").attr("pay-type");
        if (!payType) {
            mui.alert("无效的支付方式", "", function () {
                toIndexPage();
            });
            return;
        }
        //if (payType != 3) {
        //    mui.alert("接口调试中，将在近期开通", "", function () {
        //        toIndexPage();
        //    });
        //    return;
        //}

        var data_confirm = {
            orderNoStr: orderNoStr,
            totalPrice: totalPrice,
            payType: payType
        };
        $.postForm(vars.root + "/ec/mbr/confirm_recharge_pay.html", data_confirm);
    });

    $("#view-orders").click(function () {
        toOrderPage();
    });
});*/

$(function () {
    $(".mui-pull-left").click(function () {//返回按钮
        toIndexPage();
    });
    $("#view-orders").click(function () {
        toIndexPage();
    });
    $("#sub-orders").click(function () {//提交订单
        var confirmPayUrl=vars.root + "/ec/mbr/doConfirmRechargePay.do";
        var orderNoStr = $("#orderNoStr").val();
        var useBalance = $("#useBalance").val();
        var useCashCoupons = $("#useCashCoupons").val();
        var useCredits = $("#useCredits").val();
        var usePoints = $("#usePoints").val();
        var totalPrice = $("#total-price").val();
        var payType = $(".mui-selected").attr("pay-type");
        if (!payType) {
            mui.alert("无效的支付方式", "", function () {
                toIndexPage();
            });
            return;
        }
        var data_confirm = {
            orderNoStr: orderNoStr,
            useBalance: useBalance,
            useCashCoupons: useCashCoupons,
            useCredits: useCredits,
            usePoints: usePoints,
            totalPrice: totalPrice,
            payType: payType
        };
        if(payType==3){//微信支付
            $.ajax({
                data:data_confirm,
                url:confirmPayUrl,
                async: false,
                type: "POST",
                success:function(data){
                    removeloader();
                    if (data.success) {
                        if(data.data.order && data.data.payId){
                            var payId=data.data.payId;
                            var payTypeId=data.data.payTypeId;
                            var url='';
                            //获取调起支付参数
                            var url2=vars.root+"/wx/rechargePay/doUnifiedorder.html";
                            var postData2={
                                payId:payId
                            };
                            $.post(url2, postData2, function(data) {
                                if (data.success) {
                                    var dataStr="";
                                    dataStr="@"+data.data.appid+
                                    "@"+data.data.partnerid+
                                    "@"+data.data.prepayId+
                                    "@"+data.data.package+
                                    "@"+data.data.noncestr+
                                    "@"+data.data.timeStamp+
                                    "@"+data.data.sign+
                                    "@"+"recharge";
                                    toWxPayPage(dataStr)

                                }else{
                                    alert("提交失败:"+data.data.errMessage);
                                }
                            }, "json");
                        }else{
                            mui.alert('提交失败');
                        }

                    } else {
                        alert("提交失败:"+data.data.errMessage);
                    }
                }
            });
        }else{
            $.post(url, data_confirm, function(data) {
                removeloader();
                if (data.success) {
                    if(data.data.orders.length>0 && data.data.payId){
                        var payId=data.data.payId;
                        var payTypeId=data.data.payTypeId;
                        var url='';
                        if (payTypeId == 3) {//微信支付
                            url=vars.root+"/wx/pay/jsapi.html?payId=" + payId;
                        } else if (payTypeId == 2) {//支付宝
                            url= vars.root+"/pay/alipay/index.do?payId=" +payId;
                        } else if (payTypeId == 4) {
                            url= vars.root+"/ec/mbr/user_balance.html";
                        }
                        location.href=url;
                    }else{
                        mui.alert('提交失败');
                    }

                }else {
                    alert("提交失败:"+data.data.errMessage);
                }
            }, "json");
        }
    });
});
