var page = {available: 1, Invalid: 1, used: 1};
var pageSize = 5;
$(function () {
    mui('body').on('tap', ".mui-pull-left", function () {//返回按钮
        toPrePage();
    });
    mui('body').on('tap', ".mui-pull-right", function () {//返回用户中心
        toUserPage();
    });

    mui('.mui-table-view').on('tap', 'li a', function (e) {//mui冲突链接
        href = $(this).attr("href");
        toNewPage(href);
    });

    mui.init();
    //阻尼系数
    var deceleration = mui.os.ios ? 0.003 : 0.0009;
    mui('.mui-scroll-wrapper').scroll({
        bounce: false,
        indicators: true, //是否显示滚动条
        deceleration: deceleration
    });
    mui.ready(function () {
        //循环初始化所有下拉刷新，上拉加载。使用mui插件非mui
        $('.mui-slider-group .mui-scroll').each(function (i, o) {
            var id = $(this).attr("id");
            mui("#" + id).pullToRefresh({
                up: {
                    callback: function () {
                        loader();
                        var self = this;
                        setTimeout(function () {
                            var flag = listData();
                            self.endPullUpToRefresh(flag);
                        }, 100);
                    }
                }
            });
        });
        //用于第一次打开就加载数据
        listData("available");
        listData("Invalid");
        listData("used");

    });

    mui(".order-control ul").on("tap", "li", function () {//修复mui-slider切换页面
        var control = mui('.mui-slider');
        control.slider().gotoItem($(this).index());
    });

});


function listData(curType) {//根据定位的Tab页加载积分详细信息
    var flag = false;

    var type = curType;
    if (!curType) {
        type = $(".coupon-content .order-control ul li.mui-active").data("type");
    }

    $.ajax({
        type: "POST",
        url: vars.root + "/ec/mbr/doListCashCoupons.do",
        data: {
            type: type,
            async: false,
            page: page[type],
            pageSize: pageSize
        },
        async: false,
        dataType: "json",
        success: function (data) {
            page[type]++;
            setDataList(data.data.couponList, type);
            if (!data.data.couponList || pageSize > data.data.couponList.rows.length) {
                flag = true;
            }
            removeloader();
        }
    });
    return flag;
}

function setDataList(couponListData, curType) {
    var type = curType;
    if (!curType) {
        type = $(".coupon-content .order-control ul li.mui-active").data("type");
    }
    if (couponListData == null) {
        return;
    }
    var listCoupon = couponListData.rows;
    if (listCoupon == null) {
        return;
    }


    var sHtml = "";
    for (var i = 0; i < listCoupon.length; i++) {
        var o = listCoupon[i];
        //用于辨别优惠券是否使用（可用优惠券与已用优惠券的样式不同）
        var color = "coupon-color1";

        sHtml += "<li>";
        sHtml += "<a href='" + vars.root + "/ec/shop/" + o.shopId + ".html'>";
        //sHtml +="<img src='' onerror='errorImg(this);'/>";
        sHtml += "<div class='coupon-info fs-13'>";
        sHtml += o.shopName;
        sHtml += "<p class='fs-11'>";
        sHtml += "使用期限：";
        if (o.useTime != null) {
            color = "coupon-disable";
            sHtml += formatDate(o.useTime);
            sHtml += "---";
        }
        sHtml += formatDate(o.validTo);
        sHtml += "</div>";
        sHtml += "<div class='coupon-type " + color + " fs-12 c-fff'>";
        sHtml += "<div class='coupon-price fl'>";
        sHtml += "<span class='fs-8'>";
        //sHtml +="￥";
        sHtml +="</span>";
        sHtml +="<span class='font-contral font-1'>";
        sHtml += o.amount;
        sHtml += "</span>";
        sHtml += "</div>";
        sHtml += "<div class='coupon-title fl fs-8'>";
        sHtml += "<p class='fs-14 c-fff'>优惠券</p>";
        sHtml += "满" + o.orderMinAmount + "用券";
        sHtml += "</div>";
        if (o.useTime != null) {
            sHtml += "<div class='coupon-cover'></div>";
        }
        sHtml += "</div>";
        sHtml += "</a>";
        sHtml += "</li>";

    }
    $("#" + type + " .mui-table-view").append(sHtml);
};
$(function(){
   if($(".font-contral").length > 0){
        $(".font-contral").each(function(){
            var num = parseInt($(this).html()).toString().length;
            var classname = "font-1";
            if(num == 4){
                classname = "font-2"
            };
            $(this).addClass(classname);
        })
   }
});


