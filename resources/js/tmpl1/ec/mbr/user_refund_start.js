mui.init({});

$(function () {
    //initCheck();
    mui('.mui-scroll-wrapper').scroll();

    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });

    mui('body').on('shown', '.mui-popover', function (e) {
        //console.log('shown', e.detail.id);//detail为当前popover元素
        //mui(e.detail).popover('hide');//隐藏的方法

    });

    mui('body').on('hidden', '.mui-popover', function (e) {
        //console.log('hidden', e.detail.id);//detail为当前popover元素
    });
    /*mui('.mui-popover').on('tap', '.js-reason', function() {//退货原因选定
     $("#js-res").attr("js-data",$(this).attr("js-id"));
     $("#js-res").find("span").html($(this).find("a").html());
     mui('.mui-popover').popover('hide');
     });*/
    mui('body').on('tap', '.user-sub', function (e) {//提交退款申请
        var paidAmount = $("#paidAmount").val();
        var refund = $(".js-refund.mui-selected").attr("js-data");
        var reason = $("#reason option:selected").val();
        var amount = $("#refund-amount").val();
        var remark = $("#refund-description").val();
        var order = $("#orderNo").val();
        var sku = $("#skuId").val();
        var picUrlList = $("#imageUrls").val();
        var platformBalanceDiffAmount=$("#platformBalanceDiffAmount").val();
        var deliveryFeeAmount=$("#deliveryFeeAmount").val();
        if ((parseFloat(paidAmount)+parseFloat(platformBalanceDiffAmount)-parseFloat(deliveryFeeAmount)) > 0 && amount && amount > (parseFloat(paidAmount)+parseFloat(platformBalanceDiffAmount)-parseFloat(deliveryFeeAmount))) {
            mui.alert("您最多可退" + (parseFloat(paidAmount)+parseFloat(platformBalanceDiffAmount)-parseFloat(deliveryFeeAmount)) + "元");
            $("#refund-amount").val((parseFloat(paidAmount)+parseFloat(platformBalanceDiffAmount)-parseFloat(deliveryFeeAmount)));
            return;
        }
        if (remark == "") {
            mui.alert("请填写退款说明");
            return;
        }
        loader();
        jQuery.ajax({
            type: "POST",
            url: vars.root + "/ec/mbr/refund/doSaveRefund.do",
            data: {
                refund: refund,
                reason: reason,
                amount: amount,
                remark: remark,
                order: order,
                sku: sku,
                picUrlList: picUrlList
            },
            dataType: "json",
            success: function (data) {
                removeloader();
                if (data.success) {
                    location.href = vars.root + "/ec/mbr/refund/user_refund.html";
                }else{
                    mui.alert(data.errorMessage);
                }
            }
        });

    });
});

function initCheck() {
    $("#form-refund").validate({
        rules: {
            refundDescription: {
                required: true
            }
        }
    });
}
