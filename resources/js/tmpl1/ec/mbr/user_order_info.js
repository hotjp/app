/**
 * Created by Administrator on 2015/11/10.
 */
$(function () {
    $(".mui-pull-left").click(function () {//返回按钮
        toPrePage();
    });

    $(".js-cancel").click(function(e) {//取消订单
        var orderId = $("#orderId").val();
        /*var statu = confirm("确认取消订单?");
        if(!statu){
            return false;
        }*/
        var btnArray = ['否', '是'];
        mui.confirm('确认取消订单?', '', btnArray, function (e) {
            if (e.index == 1) {
                jQuery.ajax({
                    type: "POST",
                    url: vars.root + "/ec/mbr/doCancelOrder.do",
                    data: {
                        orderId : orderId
                    },
                    dataType: "json",
                    success: function (data) {
                        if(data.success){
                            mui.alert("取消订单成功！","",function(){
                                window.location.reload();
                            });
                        }else{
                            mui.alert("取消订单失败！");
                        }
                    }
                })
            } else {

            }
        });
    });
    $(".js-rec").click(function(e) {//确认收货
        var orderId = $("#orderId").val();
        /*var statu = confirm("确认已经收到货物?");
        if(!statu){
            return false;
        }*/
        var btnArray = ['否', '是'];
        mui.confirm('确认已经收到货物?', '', btnArray, function (e) {
            if (e.index == 1) {
                jQuery.ajax({
                    type: "POST",
                    url: vars.root + "/ec/mbr/doConfirmReceiptOfOrder.do",
                    data: {
                        id : orderId
                    },
                    dataType: "json",
                    success: function (data) {
                        if(data.success){
                            window.location.reload();
                        }else{

                        }
                    }
                })
            } else {
            }
        });
    });

    $(".js-pay").click(function(e) {//付款
        var ordersNoStr = $(".order-number").attr("data-no")+",";
        location.href = vars.root+"/ec/mbr/pay.html?ordersNoStr="+ordersNoStr+"";
    });

    //评价
    $('[data-btn="comment"]').click(function(e) {
        var id = $("#orderId").val();
        var sHref = vars.root+"/ec/mbr/order_comment.html";
        sHref += "?orderId=" + id;
        toNewPage(sHref);
    });

});