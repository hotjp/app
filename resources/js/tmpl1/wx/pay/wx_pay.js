$(function () {
    initPay();
});

function initPay() {

    var payId = $("#payId").val();
    if (!payId) {
        mui.alert("无效的订单","",function(){
            toIndexPage();
        });
        return;
    }

    loader(60);

    var url = vars.root + "/wx/pay/doUnifiedorder.do";
    var postData = {payId: payId};
    $.post(url, postData, function (data) {
        removeloader();
        var errMessage = "支付参数错误";
        if (data.success == true && data.data.success == true) {
            var prepayId = data.data.prepayId;
            wxPayApi(prepayId);
        } else {
            if (data.data.errMessage) {
                errMessage = data.data.errMessage;
            }
            mui.alert(errMessage,"",function(){
                toIndexPage();
            });
        }
    }, 'json');
}

function wxPayApi(prepayId) {
    var json = wxPaySign(prepayId);
    wx.ready(function () {
        wx.chooseWXPay({
            timestamp: json["timeStamp"], // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
            nonceStr: json["nonceStr"], // 支付签名随机串，不长于 32 位
            package: json["package"], // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
            signType: json["signType"], // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
            paySign: json["paySign"], // 支付签名
            success: function (res) {
                removeloader();
                toUserOrder();
            },
            cancel: function () {
                toIndexPage();
            }
        });
    });
}

function toUserOrder() {
    location.href = vars.root + "/ec/mbr/user_order.html";
}
